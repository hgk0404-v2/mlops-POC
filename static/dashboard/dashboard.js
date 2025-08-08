// static/dashboard/dashboard.js
const $ = (s) => document.querySelector(s);

const API = {
    list: async () =>
        fetch("/buckets")
        .then((r) => r.json())
        .then((d) => (Array.isArray(d) ? d : d.buckets)),
    // bucket.py가 POST /buckets?name=... 을 받도록 수정된 기준
    create: async (name) =>
        fetch(`/buckets?name=${encodeURIComponent(name)}`, { method: "POST" }),
    del: async (name) =>
        fetch(`/buckets/${encodeURIComponent(name)}`, { method: "DELETE" }),
};

async function render() {
    const tbody = $("#bucketTbody");
    tbody.innerHTML = "<tr><td colspan='2'>불러오는 중...</td></tr>";
    try {
        const buckets = await API.list();
        if (!buckets || buckets.length === 0) {
        tbody.innerHTML = "<tr><td colspan='2'>버킷이 없습니다.</td></tr>";
        return;
        }
        tbody.innerHTML = "";
        buckets.forEach((name) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${name}</td>
            <td><button class="del" data-name="${name}">삭제</button></td>
        `;
        tbody.appendChild(tr);
        });

        // 삭제 버튼들 바인딩
        tbody.querySelectorAll("button.del").forEach((btn) => {
        btn.onclick = async () => {
            const name = btn.dataset.name;
            if (!confirm(`"${name}" 버킷을 삭제할까요? (비어있는 경우만 삭제됩니다)`)) return;
            const res = await API.del(name);
            if (!res.ok) {
            let msg = "삭제 실패";
            try {
                const j = await res.json();
                msg = j.detail || msg;
            } catch {}
            alert(msg);
            }
            await render();
        };
        });
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan='2'>목록 로드 실패: ${e?.message || e}</td></tr>`;
    }
}

async function onCreate() {
    const name = $("#bucketNameInput").value.trim();
    if (!name) return alert("버킷 이름을 입력하세요.");
    const res = await API.create(name);
    if (!res.ok) {
        let msg = "생성 실패";
        try {
        const j = await res.json();
        msg = j.detail || msg;
        } catch {}
        return alert(msg);
    }
    $("#bucketNameInput").value = "";
    await render();
}

function init() {
    $("#createBtn").onclick = onCreate;   // ← HTML의 id와 일치
    $("#refreshBtn").onclick = render;    // ← HTML의 id와 일치
    render();
}

document.addEventListener("DOMContentLoaded", init);
