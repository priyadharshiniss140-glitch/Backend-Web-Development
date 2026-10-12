// Seed threads. authorId matches a user's userId:
//   userId 1 = Ada (member),  userId 2 = Linus (admin).
// Already wired — you don't need to change this.
export const THREADS = [
  { id: 1, title: "Welcome to Threadbase", body: "Say hello here.", authorId: 1, authorName: "Ada" },
  { id: 2, title: "Deploy day notes", body: "What broke and what didn't.", authorId: 2, authorName: "Linus" },
  { id: 3, title: "Favourite VS Code extensions", body: "Drop your must-haves.", authorId: 1, authorName: "Ada" },
  { id: 4, title: "Community guidelines", body: "Be kind. Ship things.", authorId: 2, authorName: "Linus" },
];
