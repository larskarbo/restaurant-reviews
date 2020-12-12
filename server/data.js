const users = [{
    username: "larskarbo",
    passwordHash: "qwerty"
}]

const restaurants = [
    {
        id: "1234-1234",
        name: "Hey Ho",
    },
    {
        id: "5098-1529",
        name: "MacDonalds LA",
    }
]

const reviews = [
    {
        id: "8668-7125",
        user: "larskarbo",
        restaurant: "1234-1234",
        rating: 5,
        text: "This is the best restaurant I have ever visited! Would love to come back."
    },
    {
        id: "9708-8146",
        user: "larskarbo",
        restaurant: "5098-1529",
        rating: 2,
        text: "I hate macdonalds\n\nIt is very bad."
    }
]

module.exports={
    users,
    restaurants,
    reviews
}