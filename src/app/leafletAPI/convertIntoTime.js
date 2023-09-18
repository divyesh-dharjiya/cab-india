function convertIntoTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = `${hours > 0 ? hours + " Hours " : ""}${minutes + " Minutes "}${seconds + " Seconds "}`;
    return obj;
}

export default convertIntoTime;