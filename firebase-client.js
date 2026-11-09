import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, writeBatch } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const persistenceReady = setPersistence(auth, browserLocalPersistence).then(() => null, error => error);

async function readCollection(name) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

async function loadProfile(uid) {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

async function loadState() {
  const [salespeople, salesEntries, salesSnapshots, monthlyTargets, annualReports] = await Promise.all([
    readCollection("salespeople"), readCollection("salesEntries"), readCollection("salesSnapshots"),
    readCollection("monthlyTargets"), readCollection("annualReports")
  ]);
  const byId = new Map(salespeople.map(person => [person.id, person]));
  const months = [...new Set(annualReports.map(row => String(row.month).slice(-2)))].sort();
  const annualSalesData = months.length ? {
    currency: "INR", months: months.map(month => {
      const row = annualReports.find(item => String(item.month).slice(-2) === month) || {};
      return { month, agro: row.agro || {}, chemical: row.chemical || {}, oil: row.oil || {}, total: row.total || {} };
    }),
    totals: { total: Object.fromEntries([2025, 2026].map(year => [String(year), annualReports.reduce((sum, row) => sum + (Number(row.total?.[year]) || 0), 0)])) }
  } : null;
  return {
    people: salespeople.map(person => ({ ...person, sales: 0, target: Number(person.target) || 0 })),
    entries: salesEntries.map(entry => ({ ...entry, person: entry.person || byId.get(entry.salespersonId)?.name || "", qty: entry.quantity ?? entry.qty, published: entry.published ?? entry.status === "published" })),
    salesSnapshots: salesSnapshots.map(row => ({ ...row, salespersonName: row.salespersonName || byId.get(row.salespersonId)?.name || row.salespersonId, amount: Number(row.amount) || 0 })),
    teamTargets: Object.fromEntries(monthlyTargets.map(row => [row.month || row.id, Number(row.teamTarget) || 0]).filter(([month]) => /^\d{4}-\d{2}$/.test(month))),
    teamTarget: Number(monthlyTargets.find(row => row.month === "2026-11")?.teamTarget) || 0,
    annualSalesData
  };
}

async function replaceCollection(name, records) {
  const old = await getDocs(collection(db, name));
  const keep = new Set(records.map(record => String(record.id)));
  const ops = [
    ...old.docs.filter(item => !keep.has(item.id)).map(item => ({ type: "delete", ref: item.ref })),
    ...records.map(record => ({ type: "set", ref: doc(db, name, String(record.id)), data: record }))
  ];
  for (let i = 0; i < ops.length; i += 450) {
    const batch = writeBatch(db);
    ops.slice(i, i + 450).forEach(op => op.type === "delete" ? batch.delete(op.ref) : batch.set(op.ref, op.data));
    await batch.commit();
  }
}

async function saveState(state) {
  if (!auth.currentUser) throw new Error("Sign in before saving business records.");
  const profile = await loadProfile(auth.currentUser.uid);
  if (profile?.role !== "admin" || profile.active === false) throw new Error("Only an active administrator can change business records.");
  const snapshots = state.salesSnapshots.map(row => ({ ...row, id: `${row.month}_${row.salespersonId}` }));
  const targetMap = state.teamTargets || { "2026-11": state.teamTarget };
  const targets = Object.entries(targetMap).map(([month, teamTarget]) => ({ id: month, month, teamTarget: Number(teamTarget) || 0 }));
  const annualReports = (state.annualSalesData?.months || []).map((row, index) => ({
    id: String(row.month || String(index + 1).padStart(2, "0")).slice(-2), month: String(row.month || String(index + 1).padStart(2, "0")).slice(-2),
    agro: row.agro || {}, chemical: row.chemical || {}, oil: row.oil || {}, total: row.total || {}
  }));
  await Promise.all([
    replaceCollection("salespeople", state.people), replaceCollection("salesEntries", state.entries),
    replaceCollection("salesSnapshots", snapshots), replaceCollection("monthlyTargets", targets),
    ...(annualReports.length ? [replaceCollection("annualReports", annualReports)] : [])
  ]);
}

async function saveAdminProfile(profile) {
  if (!auth.currentUser) throw new Error("Sign in before updating the administrator profile.");
  await setDoc(doc(db, "users", auth.currentUser.uid), { displayName: profile.name, photo: profile.photo || "", updatedAt: new Date().toISOString() }, { merge: true });
}

window.tropicaFirebase = {
  auth, db, signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
  ready: persistenceReady, signOut: () => signOut(auth), onAuthStateChanged: (callback, onError) => onAuthStateChanged(auth, callback, onError),
  loadProfile, loadState, saveState, saveAdminProfile
};
