const timetoString = (stamp: number) => 
    new Date(stamp)
        .toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            second: "numeric",
            hour: "numeric",
            minute: "numeric"
        })

export default timetoString;