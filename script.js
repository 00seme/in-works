import { toPng } from 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/+esm';

const defaults = {
  brickMode: 'texture',
  marbleMode: 'texture',
  brickColor: '#8a6649',
  brickSolidColor: '#7c624d',
  brickBlend: 76,
  marbleColor: '#e7e7e7',
  marbleSolidColor: '#efefef',
  marbleBlend: 24,
  pinColor: '#4c4c4c',
  markerColor: '#4c4c4c',
  pillColor: '#5f5f5f',
  pillTextColor: '#ffffff',
  lineColor: '#8c8c8c',
  name: '캐릭터 이름',
  engName: 'name',
  summary: '캐릭터의 간단한 개요 설명',
  keyword1: '키워드',
  keyword2: '키워드',
  brickImage: './assets/brick-default.png',
  marbleImage: './assets/marble-default.png'
};

const root = document.documentElement;
const sheet = document.getElementById('sheet');
const brickLayer = document.getElementById('brickLayer');
const marbleTargets = [sheet, ...document.querySelectorAll('.marble-subsurface')];

const elements = {
  brickMode: document.getElementById('brickMode'),
  marbleMode: document.getElementById('marbleMode'),
  brickColor: document.getElementById('brickColor'),
  brickSolidColor: document.getElementById('brickSolidColor'),
  brickBlend: document.getElementById('brickBlend'),
  marbleColor: document.getElementById('marbleColor'),
  marbleSolidColor: document.getElementById('marbleSolidColor'),
  marbleBlend: document.getElementById('marbleBlend'),
  pinColor: document.getElementById('pinColor'),
  markerColor: document.getElementById('markerColor'),
  pillColor: document.getElementById('pillColor'),
  pillTextColor: document.getElementById('pillTextColor'),
  lineColor: document.getElementById('lineColor'),
  brickUpload: document.getElementById('brickUpload'),
  marbleUpload: document.getElementById('marbleUpload'),
  mainImageInput: document.getElementById('mainImageInput'),
  subImageInput: document.getElementById('subImageInput'),
  nameInput: document.getElementById('nameInput'),
  engNameInput: document.getElementById('engNameInput'),
  summaryInput: document.getElementById('summaryInput'),
  keyword1Input: document.getElementById('keyword1Input'),
  keyword2Input: document.getElementById('keyword2Input'),
  previewName: document.getElementById('previewName'),
  previewEngName: document.getElementById('previewEngName'),
  previewSummary: document.getElementById('previewSummary'),
  previewKeyword1: document.getElementById('previewKeyword1'),
  previewKeyword2: document.getElementById('previewKeyword2'),
  mainPortrait: document.getElementById('mainPortrait'),
  subPortrait: document.getElementById('subPortrait'),
  downloadPngBtn: document.getElementById('downloadPngBtn'),
  resetBtn: document.getElementById('resetBtn')
};

let brickImageData = defaults.brickImage;
let marbleImageData = defaults.marbleImage;

function setMode(targets, mode) {
  const nodes = Array.isArray(targets) ? targets : [targets];
  const classes = ['texture-mode', 'upload-mode', 'solid-mode', 'none-mode'];
  const nextClass = `${mode}-mode`;
  nodes.forEach((node) => {
    node.classList.remove(...classes);
    node.classList.add(nextClass);
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleUpload(input, callback) {
  const file = input.files?.[0];
  if (!file) return;
  const data = await readFileAsDataUrl(file);
  callback(data);
}

function syncTextInputs() {
  elements.previewName.textContent = elements.nameInput.value || defaults.name;
  elements.previewEngName.textContent = elements.engNameInput.value || defaults.engName;
  elements.previewSummary.textContent = elements.summaryInput.value || defaults.summary;
  elements.previewKeyword1.textContent = elements.keyword1Input.value || defaults.keyword1;
  elements.previewKeyword2.textContent = elements.keyword2Input.value || defaults.keyword2;

  const folderLabel = document.querySelector('.folder-label');
  if (folderLabel) folderLabel.textContent = elements.nameInput.value || defaults.name;
}

function syncInputsFromEditable() {
  elements.nameInput.value = elements.previewName.textContent.trim();
  elements.engNameInput.value = elements.previewEngName.textContent.trim();
  elements.summaryInput.value = elements.previewSummary.textContent.trim();
  elements.keyword1Input.value = elements.previewKeyword1.textContent.trim();
  elements.keyword2Input.value = elements.previewKeyword2.textContent.trim();
  const folderLabel = document.querySelector('.folder-label');
  if (folderLabel) folderLabel.textContent = elements.previewName.textContent.trim() || defaults.name;
}

function updateTheme() {
  root.style.setProperty('--brick-color', elements.brickColor.value);
  root.style.setProperty('--brick-solid-color', elements.brickSolidColor.value);
  root.style.setProperty('--brick-alpha', String(Number(elements.brickBlend.value) / 100));
  root.style.setProperty('--marble-color', elements.marbleColor.value);
  root.style.setProperty('--marble-solid-color', elements.marbleSolidColor.value);
  root.style.setProperty('--marble-alpha', String(Number(elements.marbleBlend.value) / 100));
  root.style.setProperty('--pill-color', elements.pillColor.value);
  root.style.setProperty('--pill-text-color', elements.pillTextColor.value);
  root.style.setProperty('--pin-color', elements.pinColor.value);
  root.style.setProperty('--marker-color', elements.markerColor.value);
  root.style.setProperty('--line-color', elements.lineColor.value);
  root.style.setProperty('--brick-image', `url('${brickImageData}')`);
  root.style.setProperty('--marble-image', `url('${marbleImageData}')`);

  setMode(brickLayer, elements.brickMode.value);
  setMode(marbleTargets, elements.marbleMode.value);
}

function updatePortrait(imgEl, fileData) {
  const frame = imgEl.parentElement;
  if (!fileData) {
    imgEl.removeAttribute('src');
    frame.classList.remove('has-image');
    return;
  }
  imgEl.src = fileData;
  frame.classList.add('has-image');
}

function setupChecklistToggles() {
  document.querySelectorAll('.check-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('checked');
    });
  });
}

function bindEditableSync() {
  [
    elements.previewName,
    elements.previewEngName,
    elements.previewSummary,
    elements.previewKeyword1,
    elements.previewKeyword2,
    document.querySelector('.folder-label')
  ].forEach((node) => {
    if (!node) return;
    node.addEventListener('input', syncInputsFromEditable);
  });
}

async function downloadPng() {
  const originalShadow = sheet.style.boxShadow;
  sheet.style.boxShadow = 'none';
  try {
    const dataUrl = await toPng(sheet, {
      cacheBust: true,
      pixelRatio: 2,
      skipFonts: false
    });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'oc-sheet.png';
    link.click();
  } catch (error) {
    console.error(error);
    alert('PNG 저장에 실패했습니다. 새로고침 후 다시 시도해 주세요.');
  } finally {
    sheet.style.boxShadow = originalShadow;
  }
}

function resetEditables() {
  document.querySelector('.folder-label').textContent = defaults.name;
  document.querySelector('.relation-headline .emphasis').textContent = defaults.name;
  document.querySelector('.relation-headline span:last-child').textContent = '과 함께 언급되는 대표 인물은 ...';
  document.querySelector('.relation-name').textContent = '캐릭터 이름.';
  document.querySelector('.relation-body').textContent = '캐릭터의 간단한 개요 설명 관계성';
  document.querySelector('.role-bar').textContent = '작중 역할은 [ OC의 역할 ]. 변경점은 [ OC가 추가되면서 원작에서 바뀐 요소들 ]';
  const relationChips = document.querySelectorAll('.relation-chip');
  ['관계성 요약 남칸1', '관계성 요약 남칸2', '관계성 요약 남칸 3'].forEach((text, index) => {
    relationChips[index].textContent = text;
  });
  document.querySelectorAll('.episode-col')[0].innerHTML = '<strong>사건 포지션</strong> 　 용의자<br><strong>사건개요</strong> 　 등장 사건 개요';
  document.querySelectorAll('.episode-col')[1].innerHTML = '<strong>사건 포지션</strong> 　 용의자<br><strong>사건개요</strong> 　 등장 사건 개요';
  document.querySelector('.misc-grid').innerHTML = '<strong>작품 포지션</strong> 　 작품포지션<br>변화물<br>적자<br><br><strong>등장 빈도</strong> 　 등장 빈도도 적자';

  const checkLists = {
    appearance: ['피해자', '용의자', '범인', '목격자', '참고인', '수사 관계자', '의뢰인', '조직 관계자', '주변인', '재등장 암시', '단역+전환', '에피소드 이름'],
    affiliation: ['위장 신분', '탐정', '경시청 경찰', '경찰청 경찰', '해외 기관', '스파이', '코어', '공안', '검은조직', '학생', '일반인', '고위 관료 자제'],
    timeline: ['원작 시점', '원작 과거 시점', '원작 미래 시점', '완결 이후 시점', '생존 IF', '사망 이전', '조직 궤멸 이후', '극장판 기반', '경찰학교 시절', '조직 시절']
  };

  document.querySelectorAll('.checklist').forEach((list) => {
    const listName = list.dataset.list;
    const defaultsForList = checkLists[listName] || [];
    list.querySelectorAll('.check-item').forEach((item, index) => {
      item.querySelector('.check-toggle').classList.remove('checked');
      item.querySelector('.check-text').textContent = defaultsForList[index] || '항목';
    });
  });
}

function resetAll() {
  elements.brickMode.value = defaults.brickMode;
  elements.marbleMode.value = defaults.marbleMode;
  elements.brickColor.value = defaults.brickColor;
  elements.brickSolidColor.value = defaults.brickSolidColor;
  elements.brickBlend.value = defaults.brickBlend;
  elements.marbleColor.value = defaults.marbleColor;
  elements.marbleSolidColor.value = defaults.marbleSolidColor;
  elements.marbleBlend.value = defaults.marbleBlend;
  elements.pinColor.value = defaults.pinColor;
  elements.markerColor.value = defaults.markerColor;
  elements.pillColor.value = defaults.pillColor;
  elements.pillTextColor.value = defaults.pillTextColor;
  elements.lineColor.value = defaults.lineColor;
  elements.nameInput.value = defaults.name;
  elements.engNameInput.value = defaults.engName;
  elements.summaryInput.value = defaults.summary;
  elements.keyword1Input.value = defaults.keyword1;
  elements.keyword2Input.value = defaults.keyword2;
  brickImageData = defaults.brickImage;
  marbleImageData = defaults.marbleImage;
  elements.mainImageInput.value = '';
  elements.subImageInput.value = '';
  elements.brickUpload.value = '';
  elements.marbleUpload.value = '';
  updatePortrait(elements.mainPortrait, null);
  updatePortrait(elements.subPortrait, null);
  syncTextInputs();
  resetEditables();
  updateTheme();
}

Object.entries({
  nameInput: 'input',
  engNameInput: 'input',
  summaryInput: 'input',
  keyword1Input: 'input',
  keyword2Input: 'input',
  brickMode: 'change',
  marbleMode: 'change',
  brickColor: 'input',
  brickSolidColor: 'input',
  brickBlend: 'input',
  marbleColor: 'input',
  marbleSolidColor: 'input',
  marbleBlend: 'input',
  pinColor: 'input',
  markerColor: 'input',
  pillColor: 'input',
  pillTextColor: 'input',
  lineColor: 'input'
}).forEach(([key, eventName]) => {
  elements[key].addEventListener(eventName, () => {
    if (['nameInput', 'engNameInput', 'summaryInput', 'keyword1Input', 'keyword2Input'].includes(key)) {
      syncTextInputs();
    }
    updateTheme();
  });
});

elements.mainImageInput.addEventListener('change', async () => {
  await handleUpload(elements.mainImageInput, (data) => updatePortrait(elements.mainPortrait, data));
});

elements.subImageInput.addEventListener('change', async () => {
  await handleUpload(elements.subImageInput, (data) => updatePortrait(elements.subPortrait, data));
});

elements.brickUpload.addEventListener('change', async () => {
  await handleUpload(elements.brickUpload, (data) => {
    brickImageData = data;
    elements.brickMode.value = 'upload';
    updateTheme();
  });
});

elements.marbleUpload.addEventListener('change', async () => {
  await handleUpload(elements.marbleUpload, (data) => {
    marbleImageData = data;
    elements.marbleMode.value = 'upload';
    updateTheme();
  });
});

document.querySelectorAll('[data-clear-image]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.clearImage === 'main') {
      updatePortrait(elements.mainPortrait, null);
      elements.mainImageInput.value = '';
    } else {
      updatePortrait(elements.subPortrait, null);
      elements.subImageInput.value = '';
    }
  });
});

elements.downloadPngBtn.addEventListener('click', downloadPng);
elements.resetBtn.addEventListener('click', resetAll);

setupChecklistToggles();
bindEditableSync();
syncTextInputs();
updateTheme();
