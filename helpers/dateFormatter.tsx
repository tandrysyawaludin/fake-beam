export default function dateFormatter(date: string | number | Date) {
    let t = new Date(date)
    let hours = t.getHours();
    let minutes: string | number = t.getMinutes();

    // Find current hour in AM-PM Format
    hours = hours % 12;

    // To display "0" as "12"
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let formatted =
        ('0' + t.getDate()).slice(-2)
        + ' ' + monthNames[t.getMonth()]
        + ' ' + (t.getFullYear())
        + ' - ' + ('0' + t.getHours()).slice(-2)
        + ':' + ('0' + t.getMinutes()).slice(-2)

    return formatted
}
