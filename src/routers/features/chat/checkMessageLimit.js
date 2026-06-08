import pool from "../../../config/db"

const checkMessageLimit = async(user_id) => {
    try {
        const userMessageLimit = await pool.query("SELECT * FROM message_limit WHERE user_id=$1", [user_id]);

        if(userMessageLimit.rows.length === 0) return true;

        if(userMessageLimit.rows.length > 0) {
            const record = userMessageLimit.rows[0];
        const now = Date.now();
        const lastReset = Number(record.last_reset);

            if(now - lastReset >= 24 * 60 * 60 * 1000) {
                    await pool.query("UPDATE message_limit SET message_count = 0, last_reset = $1 WHERE user_id=$2", [now, user_id]);
                    return true;
                } 

            if(userMessageLimit.rows[0].message_count >= 15) {
                return false
            }

            return true;
        }
    } catch(error) {
        console.log(error);
        return null;
    }
}

export default checkMessageLimit