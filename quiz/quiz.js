/**
 * 퀴즈 종합 함수
 * @param {{eng: string[], kor: string[], korAccept: string[], korMain: string[]  mean: string, submit: string}[]} words 
 */
function main(words) {
 
    // 기본 세팅 (변경 X)

    var gridEl = document.getElementsByClassName("gridD")[0]

    var problemType = "";
    var problemShownType = "";
    var ansType = "";
    var ansShownType = "";
    var showMean = false;
    var showTime = false;
    var mode = 1; 

    // 추가 세팅 (재시도 시 변경 가능)
    var allCnt = words.length;
    var correctWords = [], wrongWords = [];
    var index = 1;

    /** @type {Element} */
    var probEl
    /** @type {Element} */
    var inputEl
    /** @type {Element} */
    var meanEl
    /** @type {Element} */
    var ansFormEl
    /** @type {Element} */
    var continueButtonEl
    /** @type {Element} */
    var doneButtonEl
    /** @type {Element} */
    var progressEl;
    /** @type {Element} */
    var retryButtonEl
    /** @type {Element} */
    var endButtonEl

    function enterNextCallback(e) {
        if(e.key == "Enter") {e.preventDefault; next();}
    }

    function enterCheckAnsCallback(e) {
        if(e.key == "Enter") {e.preventDefault; checkAns();}
    }

    /**
     * 다음 문제 생성
     * @param {Event} e
     */
    function next(e) {
        if(e) e.preventDefault();
        if(words.length == 0) return results();
        
        // 돌려놓기
        document.addEventListener("keypress", enterCheckAnsCallback)
        document.removeEventListener("keypress", enterNextCallback)
        
        inputEl.disabled = false;
        inputEl.value = ''
        inputEl.className = null;

        doneButtonEl.style.display = 'block';
        doneButtonEl.onclick = checkAns;
        continueButtonEl.style.display = 'none';
        continueButtonEl.onclick = null;

        // 새 문제 세팅
        index = Math.floor(Math.random() * words.length);
        
        probEl.innerHTML = ''
        probEl.innerHTML = words[index][problemShownType].join(',&nbsp;');
        if(showMean) meanEl.innerHTML = words[index].mean;
    }

    /**
     * 정답 확인
     * @param {Event} e 
     */
    function checkAns(e) {
        if(e) e.preventDefault();
        
        // 돌려놓기
        document.addEventListener("keypress", enterNextCallback)
        document.removeEventListener("keypress", enterCheckAnsCallback)
        
        inputEl.disabled = true;

        doneButtonEl.style.display = 'none';
        doneButtonEl.onsubmit = null;
        continueButtonEl.style.display = 'block';
        continueButtonEl.onclick = next;

        // 정답 확인
        inputAns = inputEl.value
        rightAns = words[index][ansType]
        words[index].submit = inputAns;
        if(rightAns.includes(inputAns)) {inputEl.className = "correct"; correctWords.push(words.splice(index, 1)[0]);}
        else {inputEl.className = "wrong"; probEl.innerHTML += `&nbsp;<span class='corrAns'>&nbsp;${words[index][ansShownType].join(`&nbsp;</span>&nbsp;<span class='corrAns'>&nbsp;`)}&nbsp;</span>`; wrongWords.push(words.splice(index, 1)[0]);}

        // 진척도 표시
        progressEl.innerHTML = `${allCnt}개 단어 중 &nbsp;<span class="corrCnt">&nbsp;${correctWords.length}개 정답&nbsp;</span>&nbsp;<span class="wrongCnt">&nbsp;${wrongWords.length}개 오답&nbsp;</span>&nbsp;<span class="leftCnt">&nbsp;${words.length}개 남음&nbsp;</span>`
        if(words.length == 0) {results()}
    }

    /**
     * 시작
     */
    function start() {
        gridEl.innerHTML = 
        `<div id="progress">
            ${allCnt}개 단어 중 &nbsp;<span class="corrCnt">&nbsp;0개 정답&nbsp;</span>&nbsp;<span class="wrongCnt">&nbsp;0개 오답&nbsp;</span>&nbsp;<span class="leftCnt">&nbsp;${allCnt}개 남음&nbsp;</span>
        </div>
        <div class="problem">
            <div class="prob"> 문제 </div>
            ${showMean?"<div class='mean'> 영영풀이 </div>":""}
        </div>
        <div class="ans">
            <form id="ansForm">
                <div class="guide">${(mode == 2)?"뜻":"영단어"}</div>
                <input type="text" name="ans" id="ans" id="ansForm" autocomplete="off">
                <input type="submit" name="done" id="done" value="정답 제출하기" id="ansForm">
            </form>
            <button id="continue">계속하기</button>
        </div>`
        probEl = document.getElementsByClassName("prob")[0];
        meanEl = document.getElementsByClassName("mean")[0];
        ansFormEl = document.getElementById("ansForm");
        ansFormEl.onsubmit = (e) => {e.preventDefault();};
        inputEl = document.getElementById("ans");
        doneButtonEl = document.getElementById("done");
        doneButtonEl.onclick = checkAns;
        continueButtonEl = document.getElementById("continue");
        continueButtonEl.onclick = next;
        progressEl = document.getElementById("progress");

        for(i in words) {
            words[i].kor = words[i].korMain.concat(words[i].korAccept)
        }

        next();
    };

    /**
     * 결과 확인 및 재시도 결정
     */
    function results() {
        gridEl.innerHTML = 
        `<div class="cnt">
            <div class="correct"> ${correctWords.length} / ${allCnt}</div>
            <div class="wrong"> ${wrongWords.length} / ${allCnt}</div>
            <a id="end" href="../index.html">메인 화면으로 돌아가기</a>
            ${(wrongWords.length)?"<button id='continue'>틀린 단어만 다시하기</button>":''}
        </div>`
        listText = 
        `<div class="list">
            <table><tbody>
                <tr class="legends Head"><td>문제</td><td>정답</td><td>제출 답안</td></tr>
                <tr class="correct Head"><td colspan="3">맞춘 단어</td></tr>`
        for(i in correctWords) {
            listText += `<tr class="correct Li ${(i==correctWords.length-1)?'last':''}"><td>${correctWords[i][problemShownType].join(', ')}</td><td>${correctWords[i][ansShownType].join(', ')}</td><td>${correctWords[i].submit}</td></tr>`;
        }
        listText += 
        `       <tr class="wrong Head"><td colspan="3">틀린 단어</td></tr>`
        for(i in wrongWords) {
            listText += `<tr class="wrong Li ${(i==wrongWords.length-1)?'last':''}"><td>${wrongWords[i][problemShownType].join(', ')}</td><td>${wrongWords[i][ansShownType].join(', ')}</td><td>${wrongWords[i].submit}</td></tr>`;
        }
        listText += 
        `   </tbody></table>
        </div>` 
        gridEl.innerHTML += listText  

        continueButtonEl = document.getElementById('continue')
        continueButtonEl.onclick = (e) => {
            words = wrongWords;
            correctWords = [];
            wrongWords = [];
            allCnt = words.length;

            start()
        }
    }

    /**
     * 옵션 설정
     */
    function options() {
        gridEl.innerHTML = 
        `<form class="options" id="options">
            <div>
                <label for="kte"> <input type="radio" name="mode" id="kte" value="1" form="options" required> 뜻 보고 단어 맞추기</label>
                <label for="etk"> <input type="radio" name="mode" id="etk" value="2" form="options"> 단어 보고 뜻 맞추기</label>
            </div>

            <div>
                <label for="mean"> <input type="checkbox" name="mean" id="mean" form="options"> 영영풀이 보이기</label>
            </div>

            <div>
                <label for="timer"> <input type="checkbox" name="timer" id="timer" form="options"> 타이머 보이기</label>
            </div>

            <input type="submit" value="시작하기" id="done" form="options">
        </div>`;
        
        // Option Submit Event
        
        optionFormEl = document.getElementById("options");
        optionFormEl.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const formData = new FormData(optionFormEl);
            
            mode = formData.get("mode")
            if(mode == 1) {problemType = 'kor'; problemShownType = 'korMain'; ansType = 'eng'; ansShownType = 'eng';}
            else {problemType = 'eng'; problemShownType = 'eng'; ansType = 'kor'; ansShownType='korMain';}
            showMean = formData.get("mean")=='true';
            showTime = formData.get("timer")=='false';
            
            start();
        })
        
        optionFormEl.addEventListener("formdata", (e) => {
            const formData = e.formData;
            formData.set("mode", formData.get("mode"));
            formData.set("mean", Boolean(formData.get("mean")));
            formData.set("timer", Boolean(formData.get("timer")));
        });
    }

    options()
}