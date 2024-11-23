export default async function page() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/nums`);
    
    // 응답이 JSON이 아닐 경우 에러 발생 방지
    if (!res.ok) {
        console.error(`Failed to fetch API: ${res.statusText}`);
        return (
            <div>
                <p>Failed to load data</p>
            </div>
        );
    }

    const data = await res.json(); // JSON 데이터 파싱

    return (
        <div>
            <p>{data.text}</p>
        </div>
    );
}
