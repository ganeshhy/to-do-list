<template>
  <div class="container">
    <h1>Vue + Firestore CRUD (Tasks)</h1>

    <form @submit.prevent="addTask">
      <input v-model="newTask" placeholder="New task" />
      <button type="submit">Add</button>
    </form>

    <ul>
      <li v-for="t in tasks" :key="t.id" style="margin:8px 0;">
        <input type="checkbox" :checked="t.done" @change="toggleDone(t)" />
        <span v-if="editingId !== t.id" :style="{ textDecoration: t.done ? 'line-through' : 'none' }">
          {{ t.title }}
        </span>
        <input v-else v-model="editedTitle" @keyup.enter="saveEdit(t)" />

        <button v-if="editingId !== t.id" @click="startEdit(t)">Edit</button>
        <button v-else @click="saveEdit(t)">Save</button>
        <button @click="deleteTask(t)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { db } from './firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

const tasks = ref([]);
const newTask = ref('');
const editedTitle = ref('');
const editingId = ref(null);

const tasksCol = collection(db, 'tasks');
const q = query(tasksCol, orderBy('createdAt', 'desc'));
let unsub = null;

onMounted(() => {
  unsub = onSnapshot(q, (snapshot) => {
    tasks.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }, (err) => {
    console.error('Firestore snapshot error:', err);
  });
});

onUnmounted(() => {
  if (unsub) unsub();
});

const addTask = async () => {
  const title = newTask.value && newTask.value.trim();
  if (!title) return;
  try {
    await addDoc(tasksCol, { title, done: false, createdAt: serverTimestamp() });
    newTask.value = '';
  } catch (e) {
    console.error(e);
  }
};

const toggleDone = async (task) => {
  try {
    const ref = doc(db, 'tasks', task.id);
    await updateDoc(ref, { done: !task.done });
  } catch (e) {
    console.error(e);
  }
};

const deleteTask = async (task) => {
  if (!confirm('Delete this task?')) return;
  try {
    await deleteDoc(doc(db, 'tasks', task.id));
  } catch (e) {
    console.error(e);
  }
};

const startEdit = (task) => {
  editingId.value = task.id;
  editedTitle.value = task.title;
};

const saveEdit = async (task) => {
  const title = editedTitle.value && editedTitle.value.trim();
  if (!title) return;
  try {
    await updateDoc(doc(db, 'tasks', task.id), { title });
    editingId.value = null;
    editedTitle.value = '';
  } catch (e) {
    console.error(e);
  }
};
</script>

<style>
.container { max-width:700px; margin:2rem auto; padding:1rem; font-family:Arial, sans-serif; }
input { margin-right:6px; }
button { margin-left:4px; }
</style>
