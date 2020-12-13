const users = [{
    username: "larskarbo",
    passwordHash: "qwerty",
    role: "user"
}]

const restaurants = [
    {
        id: "1234-1234",
        name: "Hey Ho",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
    {
        id: "5098-1529",
        name: "MacDonalds LA",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    }
]

const reviews = [
    {
        id: "8668-7125",
        user: "larskarbo",
        role: "user",
        restaurant: "1234-1234",
        rating: 5,
        dateOfVisit: "2020-12-04",
        text: "This is the best restaurant I have ever visited! Would love to come back."
    },
    {
        id: "9708-8146",
        user: "larskarbo",
        restaurant: "5098-1529",
        rating: 2,
        dateOfVisit: "2020-12-06",
        text: "I hate macdonalds\n\nIt is very bad."
    }
]
const comments = [
    {
        id: "2321-9805",
        user: "larskarbo",
        review: "3514-5918",
        text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo."
    },
]

module.exports={
    users,
    restaurants,
    reviews,
    comments
}