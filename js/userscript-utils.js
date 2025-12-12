// 跟踪当前显示的toast数量
let activeToasts = 0;
const TOAST_MARGIN = 3; // 每个toast之间的垂直间距
const TOAST_BOTTOM_MARGIN = 20; // 第一个toast距离底部的距离

function showToast(message, duration = 3000) {
    // 创建 toast 容器
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = `${TOAST_BOTTOM_MARGIN}px`;
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // 如果已有toast，为新toast添加下边距
    if (activeToasts > 0) {
        toast.style.marginBottom = `${TOAST_MARGIN}px`;
    }

    // 增加活跃toast计数
    activeToasts++;

    // 添加到文档中
    document.body.appendChild(toast);

    // 渐显效果
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);

    // 定时移除 toast
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
            // 减少活跃toast计数
            activeToasts--;
        }, 300); // 等待渐隐动画完成
    }, duration);
}

function wait4Element(getElementFn, callback) {
    const elementInfo = (element) => {
        if (!element) {
            return 'Element not found yet...';
        } else if (element.tagName) {
            const info = `<${element.tagName.toLowerCase()}>`;
            const text = element.textContent.trim() ? ` - "${element.textContent.trim()}"` : '';
            return `Element found: ${info}${text}`;
        } else {
            return 'Element found: ' + element;
        }
    };

    const element = getElementFn();
    if (element !== null) {
        console.log('Element already exists:', element);
        showToast(elementInfo(element));
        callback(element);
        return;
    }

    showToast('Monitoring for element...');

    const observer = new MutationObserver(() => {
        console.log('DOM changed, checking for element...');
        const element = getElementFn();
        if (element !== null) {
            console.log('Element found:', element);
            showToast(elementInfo(element));
            callback(element);
            observer.disconnect(); // 停止观察
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

window.showToast = showToast;
window.wait4Element = wait4Element;
