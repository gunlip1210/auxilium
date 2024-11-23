// POST 요청으로 보낼 것.

export default function handler(req, res) {
    // POST 요청 처리
    if (req.method === 'POST') {
        const { id, password } = req.body;

        // id와 password가 있는지 확인
        if (!id || !password) {
            return res.status(400).json({ error: "id and password are required" });
        }

        // id와 password를 사용하여 처리할 로직 추가
        // 예: 데이터베이스에서 확인하거나 인증 수행

        res.status(200).json({ CookieValue: "01ff44acc16ba72eb9796b54132011cc73acad69" });
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // POST가 아닌 요청을 처리
    }
}