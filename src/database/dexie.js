import Dexie from 'dexie';

export const db = new Dexie('myDatabase');

db.version(1).stores({
  conversations: '++id, keyConversation', // Primary key and indexed props
});

