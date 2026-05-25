(function () {

    function injectEditButtons() {
        const vault = document.getElementById('vault');
        if (!vault) return;
        setTimeout(() => {
            Array.from(vault.getElementsByClassName('card')).forEach((card, i) => {
                const controls = card.querySelector('.controls');
                if (!controls || controls.querySelector('.btn-edit')) return;

                const editBtn = document.createElement('button');
                editBtn.className = 'btn-edit';
                editBtn.textContent = 'Edit';
                editBtn.style.backgroundColor = '#2986cc';
                editBtn.style.color = '#fff';

                editBtn.onclick = function () {
                    openEditDialog(i);
                };
                controls.insertBefore(editBtn, controls.firstChild);
            });
        }, 0);
    }

    function openEditDialog(index) {
        let data = JSON.parse(localStorage.getItem('pm_data')) || { passwords: [] };
        const entry = data.passwords[index];
        if (!entry) return;

        const existing = document.getElementById('editor-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'editor-modal';
        modal.style.position = 'fixed';
        modal.style.zIndex = 9999;
        modal.style.left = 0;
        modal.style.top = 0;
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(24,24,24,0.93)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        const inner = document.createElement('div');
        inner.style.background = '#181818';
        inner.style.padding = '1.5rem 2rem';
        inner.style.borderRadius = '16px';
        inner.style.boxShadow = '0 4px 32px #000c';
        inner.style.width = '100%';
        inner.style.maxWidth = '400px';
        inner.style.color = '#e0e0e0';

        inner.innerHTML = `
            <h2>Edit Password</h2>
            <form id="editForm" autocomplete="off">
                <div style="margin-bottom:12px">
                    <label for="edit-title" style="display:block;margin-bottom:4px">Title</label>
                    <input type="text" id="edit-title" required value="${escapeHTML(entry.title)}" style="width:100%;padding:10px;border-radius:6px;border:1px solid #333;background:#232323;color:#fff">
                </div>
                <div style="margin-bottom:12px">
                    <label for="edit-username" style="display:block;margin-bottom:4px">Username / Email</label>
                    <input type="text" id="edit-username" required value="${escapeHTML(entry.username)}" style="width:100%;padding:10px;border-radius:6px;border:1px solid #333;background:#232323;color:#fff">
                </div>
                <div style="margin-bottom:12px">
                    <label for="edit-password" style="display:block;margin-bottom:4px">Password</label>
                    <input type="password" id="edit-password" required value="${escapeHTML(entry.password)}" autocomplete="new-password" style="width:100%;padding:10px;border-radius:6px;border:1px solid #333;background:#232323;color:#fff">
                </div>
                <div style="margin-bottom:12px">
                    <label for="edit-url" style="display:block;margin-bottom:4px">URL</label>
                    <input type="url" id="edit-url" value="${escapeHTML(entry.url || '')}" style="width:100%;padding:10px;border-radius:6px;border:1px solid #333;background:#232323;color:#fff">
                </div>
                <div style="margin-bottom:16px">
                    <label for="edit-notes" style="display:block;margin-bottom:4px">Notes</label>
                    <textarea id="edit-notes" rows="3" style="width:100%;padding:10px;border-radius:6px;border:1px solid #333;background:#232323;color:#fff">${escapeHTML(entry.notes || '')}</textarea>
                </div>
                <div style="display:flex;gap:12px">
                    <button type="submit" style="flex:1;background:#bb86fc;color:#121212;font-weight:bold;border:none;padding:12px;border-radius:6px;cursor:pointer">Save</button>
                    <button type="button" id="editor-cancel" style="flex:1;background:#232323;color:#fff;font-weight:bold;border:none;padding:12px;border-radius:6px;cursor:pointer">Cancel</button>
                </div>
            </form>
        `;

        modal.appendChild(inner);
        document.body.appendChild(modal);

        modal.querySelector('#editor-cancel').onclick = function () {
            modal.remove();
        };

        modal.querySelector('#editForm').onsubmit = function (e) {
            e.preventDefault();
            entry.title = modal.querySelector('#edit-title').value.trim();
            entry.username = modal.querySelector('#edit-username').value.trim();
            entry.password = modal.querySelector('#edit-password').value;
            entry.url = modal.querySelector('#edit-url').value.trim();
            entry.notes = modal.querySelector('#edit-notes').value.trim();

            data.passwords[index] = entry;
            localStorage.setItem('pm_data', JSON.stringify(data));
            modal.remove();
            if (typeof loadPasswords === "function") {
                loadPasswords();
                setTimeout(injectEditButtons, 30);
            } else {
                location.reload();
            }
        };

        modal.tabIndex = -1;
        modal.focus();
        modal.addEventListener('keydown', function (ev) {
            if (ev.key === "Escape") {
                modal.remove();
            }
        });
    }

    function escapeHTML(str) {
        return (str || "")
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function patchLoadPasswords() {
        if (window.loadPasswords && !window.loadPasswords._editPatched) {
            const orig = window.loadPasswords;
            window.loadPasswords = function() {
                const result = orig.apply(this, arguments);
                setTimeout(injectEditButtons, 20);
                return result;
            };
            window.loadPasswords._editPatched = true;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            patchLoadPasswords();
            injectEditButtons();
        });
    } else {
        patchLoadPasswords();
        injectEditButtons();
    }
})();