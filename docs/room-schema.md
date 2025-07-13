Room Schema Example:

rooms/
├── {roomId}/
│ ├── createdAt: timestamp
│ ├── createdBy: string (userId)
│ ├── participants/
│ │ ├── {userId}/
│ │ │ ├── userId: string
│ │ │ ├── point: number | null
│ │ │ ├── isActive: boolean
│ │ │ ├── username: string
│ │ │ ├── imageUrl: string
│ │ │ ├── breakStatus: 'none' | 'Indefinite' | 'time'
│ │ │ └── breakSeconds: number
│ ├── reactions/
│ │ ├── {reactionId}/
│ │ │ ├── userId: string
│ │ │ ├── reaction: string
│ │ │ └── timestamp: timestamp
│ ├── roomName: string
│ └── status: "voting" | "completed" | "waiting"

Example Data:
{
"rooms": {
"room123": {
"createdAt": 1709123456789,
"createdBy": "user456",
"participants": {
"user456": {
"userId": "user456",
"point": 5,
"isActive": true,
"username": "John",
"imageUrl": "https://api.dicebear.com/9.x/avataaars/svg?seed=Jack"
},
"user789": {
"userId": "user789",
"point": null,
"isActive": true,
"username": "Jane",
"imageUrl": "https://api.dicebear.com/9.x/avataaars/svg?seed=Eliza"
}
},
"roomName": "Sprint Planning",
"status": "voting"
}
}
}
