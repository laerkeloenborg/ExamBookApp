export async function ReadBook(book, setSelectedBook, setModalVisible){
    const API_KEY = "2563cf30fc764102b3862e2cfec6e705"

    const response = await fetch(
        `https://api.bigbookapi.com/${book.id}?api-key=${API_KEY}`
    )

    const data = await response.json()

    const formattedBook = {

        id: data.id || "Unknown id",

        title: data.title || "Unknown title",

        author: data.authors
            ? data.authors.map(a => a.name).join(", ")
            : "Unknown author",

        image: data.image ||

            "https://cdn-icons-png.flaticon.com/512/2232/2232688.png",

        rating: data.rating?.average || "No rating",

        description:
            data.description ||
            "No description available"

    }

    setSelectedBook(formattedBook)
    setModalVisible(true)
}