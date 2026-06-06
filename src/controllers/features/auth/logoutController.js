

const logout = async(req, res) => {
    try {
        res.clearCookie("token");

        res.status(200).json({ success: true, message: "Logged out successfully!" });
    } catch(error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to log out!" });
    }
}

export default logout;