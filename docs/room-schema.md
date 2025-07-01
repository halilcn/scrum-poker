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
"username": "John"
},
"user789": {
"userId": "user789",
"point": null,
"isActive": true,
"username": "Jane"
}
},
"roomName": "Sprint Planning",
"status": "voting"
}
}
}
