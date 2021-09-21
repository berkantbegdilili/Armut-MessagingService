db = db.getSiblingDB("MessagingService")
db.createUser(
    {
        user: "berkant",
        pwd: "armut",
        roles: [
            {
                role: "readWrite",
                db: "MessagingService"
            }
        ]
    }
);