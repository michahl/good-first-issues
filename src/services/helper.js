const formatDate = (dateString) => {
    const date = new Date(dateString)

    const dateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }

    const formattedDate = date.toLocaleDateString('en-GB', dateOptions)
    const formattedTime = date.toLocaleTimeString('en-GB', timeOptions)

    return `${formattedDate}, ${formattedTime}`
}

export default {
    formatDate
}