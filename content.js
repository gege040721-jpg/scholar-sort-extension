// Google Scholar Citation Sorter
(function() {
  'use strict';

  let isSorted = false;
  let originalOrder = [];

  // 提取引用次数
  function getCitationCount(element) {
    const links = element.querySelectorAll('a');
    for (const link of links) {
      const text = link.textContent;
      if (text.includes('Cited by') || text.includes('被引用')) {
        const match = text.match(/\d+/);
        if (match) {
          return parseInt(match[0], 10);
        }
      }
    }
    return 0;
  }

  // 保存原始顺序
  function saveOriginalOrder() {
    const container = document.querySelector('#gs_res_ccl_mid');
    if (!container) return;

    const results = container.querySelectorAll('.gs_r.gs_or.gs_scl');
    originalOrder = Array.from(results);
  }

  // 恢复原始顺序
  function restoreOriginalOrder() {
    const container = document.querySelector('#gs_res_ccl_mid');
    if (!container || originalOrder.length === 0) return;

    // 移除引用徽章
    document.querySelectorAll('.citation-badge').forEach(badge => badge.remove());

    // 恢复原始顺序
    originalOrder.forEach(item => {
      container.appendChild(item);
    });

    console.log('Scholar Sorter: Restored original order');
  }

  // 按引用次数排序
  function sortByCitations() {
    const container = document.querySelector('#gs_res_ccl_mid');
    if (!container) {
      console.log('Scholar Sorter: Results container not found');
      return;
    }

    const results = Array.from(container.querySelectorAll('.gs_r.gs_or.gs_scl'));
    if (results.length === 0) {
      console.log('Scholar Sorter: No results found');
      return;
    }

    // 获取每个结果的引用次数
    const resultsWithCitations = results.map(result => ({
      element: result,
      citations: getCitationCount(result)
    }));

    // 按引用次数排序（从高到低）
    resultsWithCitations.sort((a, b) => b.citations - a.citations);

    // 重新排列 DOM
    resultsWithCitations.forEach(item => {
      container.appendChild(item.element);
    });

    // 添加引用次数标签
    resultsWithCitations.forEach(item => {
      if (!item.element.querySelector('.citation-badge')) {
        const badge = document.createElement('span');
        badge.className = 'citation-badge';
        badge.textContent = `${item.citations} citations`;
        const titleElement = item.element.querySelector('.gs_rt');
        if (titleElement) {
          titleElement.appendChild(badge);
        }
      }
    });

    console.log(`Scholar Sorter: Sorted ${results.length} results by citation count`);
  }

  // 切换排序状态
  function toggleSort() {
    const button = document.querySelector('#scholar-sort-btn');

    if (!isSorted) {
      // 保存原始顺序并排序
      if (originalOrder.length === 0) {
        saveOriginalOrder();
      }
      sortByCitations();
      isSorted = true;
      button.textContent = 'Restore Original Order';
      button.classList.add('sorted');
    } else {
      // 恢复原始顺序
      restoreOriginalOrder();
      isSorted = false;
      button.textContent = 'Sort by Citations';
      button.classList.remove('sorted');
    }
  }

  // 创建排序按钮
  function createSortButton() {
    const existingButton = document.querySelector('#scholar-sort-btn');
    if (existingButton) return;

    // 创建容器
    const container = document.createElement('div');
    container.id = 'sort-btn-container';

    const button = document.createElement('button');
    button.id = 'scholar-sort-btn';
    button.textContent = 'Sort by Citations';
    button.onclick = toggleSort;

    container.appendChild(button);

    // 插入到搜索结果上方
    const resultsContainer = document.querySelector('#gs_res_ccl_mid');
    if (resultsContainer && resultsContainer.parentNode) {
      resultsContainer.parentNode.insertBefore(container, resultsContainer);
    }
  }

  // 初始化
  function init() {
    // 等待页面加载完成
    setTimeout(() => {
      createSortButton();
      saveOriginalOrder();
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
