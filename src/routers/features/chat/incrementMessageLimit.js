

const incrementMessageLimit = async(user_id) => {
    let userMessageLimit;

    try {
        userMessageLimit = await pool.query("SELECT * FROM message_limit WHERE user_id=$1", [user_id]);

        if(userMessageLimit.rows.length === 0) {
            const lastReset = Date.now();
            await pool.query("INSERT INTO message_limit (user_id, message_count, last_reset) VALUES ($1, $2, $3) RETURNING *", 
                [user_id, 1, lastReset]);
        } else {
            await pool.query("UPDATE message_limit SET message_count = message_count + 1 WHERE user_id=$1", [user_id]);
        }
    } catch(error) {
        console.log(error);
    }
}

export default incrementMessageLimit;