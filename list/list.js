/**
 * 목록 종합 함수
 * @param {{eng: string[], kor: string[], korAccept: string[], korMain: string[]  mean: string, submit: string}[]} words 
 */
function main(words) {
    mainEl = document.getElementsByTagName("main")[0]
    mainEl.innerHTML = 
    `<div class="info">
        <input id="infoCheck" type="checkbox" style="display: none;">
        <label for="infoCheck"><div>이용안내 확인하기</div><div></div></label>
        <div>
            <div>뜻은 기본적으로 제공된 프린트와 수업 중 언급된 것을 표기하였으며,</div>
            <div>이와 비슷한 일부 단어는 유사 답안으로 인정합니다.</div>
            <div>(단어 오른쪽 <span style="color: var(--thm-c);"></span>에 마우스를 올리면 유사 답안 목록이 나타납니다.)</div>
        </div>
    </div>
    `
    for (i in words) {
        mainEl.innerHTML += 
        `<div class="word">
            <div class="eng">${words[i].eng.join(', ')}</div>
            <div style="color: var(--thm-c); font-size: calc((1.5 * var(--fs)));">|</div>
            <div class="kor">
                ${words[i].korMain.join(', ')}
                ${(words[i].korAccept.length)?`<div class="korAccept"><div></div><div>${words[i].korAccept.join(', ')}</div></div>`:''}
            </div>
            <div class="mean">${words[i].mean.replaceAll('<br/>', ' ')}</div>
        </div>`;
    }
}