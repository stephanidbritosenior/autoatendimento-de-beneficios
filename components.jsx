/* SDS Desktop — primitive components
   Loaded via <script type="text/babel" src="components.jsx">.
   Exports to window so other JSX files can use them. */

const { useState, useRef, useEffect, useCallback } = React;

// ─── Senior brand glyph (SVG inline; tiny) ─────────────────────────
const SeniorGlyph = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 348 613" fill="currentColor" aria-hidden="true">
        <path d="M174.719 518.932L258.161 439.782C264.546 433.762 269.614 426.603 273.072 418.719C276.53 410.834 278.31 402.378 278.31 393.838C278.31 385.298 276.53 376.843 273.072 368.958C269.614 361.073 264.546 353.915 258.161 347.895L174.719 269.199C168.45 263.304 163.474 256.289 160.077 248.56C156.681 240.83 154.933 232.539 154.933 224.165C154.933 215.792 156.681 207.501 160.077 199.771C163.474 192.042 168.45 185.027 174.719 179.132L303.718 301.496C329.517 326.089 344 359.371 344 394.066C344 428.76 329.517 462.043 303.718 486.635L174.719 609C168.45 603.105 163.474 596.09 160.077 588.36C156.681 580.631 154.933 572.34 154.933 563.966C154.933 555.592 156.681 547.301 160.077 539.572C163.474 531.842 168.45 524.828 174.719 518.932ZM173.76 94.0677L90.3189 173.218C83.9334 179.238 78.8659 186.397 75.408 194.281C71.95 202.166 70.1698 210.622 70.1698 219.162C70.1698 227.702 71.95 236.157 75.408 244.042C78.8659 251.927 83.9334 259.085 90.3189 265.105L173.76 344.256C180.03 350.151 185.006 357.166 188.402 364.895C191.798 372.625 193.547 380.916 193.547 389.289C193.547 397.663 191.798 405.954 188.402 413.684C185.006 421.413 180.03 428.428 173.76 434.323L44.2823 311.504C18.4832 286.911 4 253.629 4 218.934C4 184.24 18.4832 150.957 44.2823 126.365L173.76 4C186.213 16.0129 193.192 32.1861 193.192 49.0338C193.192 65.8815 186.213 82.0547 173.76 94.0677Z"/>
    </svg>
);

// ─── Button — s-button equivalent ──────────────────────────────────
function Button({
    priority = 'primary', size = 'default', icon, rightIcon, children, onClick,
    disabled = false, auxiliary = false, iconOnly = false, type = 'button', className = '', style
}) {
    const cls = [
        'btn', `btn-${priority}`,
        size === 'small' && 'btn-small',
        auxiliary && 'btn-aux',
        iconOnly && 'btn-icon',
        className
    ].filter(Boolean).join(' ');
    return (
        <button type={type} className={cls} style={style} disabled={disabled} onClick={onClick}>
            {icon && <i className={`fa ${icon}`} aria-hidden="true" />}
            {children && <span>{children}</span>}
            {rightIcon && <i className={`fa ${rightIcon}`} aria-hidden="true" />}
        </button>
    );
}

// ─── Field — label + input + helper ────────────────────────────────
function Field({ label, required, hint, helper, error, children }) {
    return (
        <div className="field">
            {label && (
                <div className="label">
                    {label}
                    {required && <span className="req"> *</span>}
                    {hint && (
                        <Tooltip text={hint}>
                            <span className="hint"><i className="fa fa-info-circle" /></span>
                        </Tooltip>
                    )}
                </div>
            )}
            {children}
            {(helper || error) && (
                <div className={`helper ${error ? 'error' : ''}`}>{error || helper}</div>
            )}
        </div>
    );
}

// ─── Textfield ─────────────────────────────────────────────────────
function Textfield({ value = '', onChange, placeholder, prefix, suffix, error, disabled, type = 'text', readOnly }) {
    return (
        <div className={`input-shell ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
            {prefix && <span className="affix">{prefix}</span>}
            <input
                type={type} value={value} placeholder={placeholder} disabled={disabled} readOnly={readOnly}
                onChange={e => onChange && onChange(e.target.value)}
            />
            {suffix && <span className="affix">{suffix}</span>}
        </div>
    );
}

// ─── Textarea ──────────────────────────────────────────────────────
function Textarea({ value = '', onChange, placeholder, rows = 3, disabled, error, maxLength }) {
    return (
        <div className={`input-shell textarea-shell ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
            <textarea
                rows={rows} value={value} placeholder={placeholder} disabled={disabled} maxLength={maxLength}
                onChange={e => onChange && onChange(e.target.value)}
            />
        </div>
    );
}

// ─── Select — minimal dropdown ─────────────────────────────────────
function Select({ value, onChange, options = [], placeholder = 'Selecione…', disabled, error }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    useEffect(() => {
        const onDoc = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);
    const selected = options.find(o => o.value === value);
    return (
        <div ref={wrapRef} style={{ position: 'relative' }}>
            <div
                className={`input-shell ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setOpen(o => !o)}
                style={{ cursor: disabled ? 'default' : 'pointer' }}
            >
                <span style={{ flex: 1, color: selected ? 'var(--sds-fg-default)' : 'var(--sds-fg-subtle)', fontSize: 14 }}>
                    {selected ? selected.label : placeholder}
                </span>
                <span className="caret"><i className={`fa fa-caret-${open ? 'up' : 'down'}`} /></span>
            </div>
            {open && (
                <div className="menu" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 20 }}>
                    {options.map(o => (
                        <div key={o.value} className="menu-item" onClick={() => { onChange && onChange(o.value); setOpen(false); }}>
                            {o.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Checkbox / Radio / Switch ─────────────────────────────────────
function Checkbox({ checked, indeterminate, onChange, children, disabled }) {
    return (
        <label className="cb-row" style={{ cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
            <span className={`cb ${checked || indeterminate ? 'checked' : ''}`} onClick={() => !disabled && onChange && onChange(!checked)}>
                {indeterminate ? <i className="fa fa-minus" /> : checked ? <i className="fa fa-check" /> : null}
            </span>
            <span>{children}</span>
        </label>
    );
}
function Radio({ checked, onChange, children, name, value, disabled }) {
    return (
        <label className="rb-row" style={{ cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
            <span className={`rb ${checked ? 'checked' : ''}`} onClick={() => !disabled && onChange && onChange(value)} />
            <span>{children}</span>
        </label>
    );
}
function Switch({ on, onChange, children, disabled }) {
    return (
        <div className="sw-row" style={{ opacity: disabled ? 0.5 : 1 }}>
            <span className={`sw ${on ? 'on' : ''}`} onClick={() => !disabled && onChange && onChange(!on)} />
            {children && <label onClick={() => !disabled && onChange && onChange(!on)}>{children}</label>}
        </div>
    );
}

// ─── Badge ─────────────────────────────────────────────────────────
function Badge({ color = 'blue', type = 'pill', icon, children }) {
    return (
        <span className={`badge ${color} ${type === 'chip' ? 'chip' : ''}`}>
            {icon && <i className={`fa ${icon}`} />}
            {children}
        </span>
    );
}

// ─── Panel ─────────────────────────────────────────────────────────
function Panel({ title, severity = 'default', actions, footer, children }) {
    return (
        <div className={`panel severity-${severity}`}>
            {title && (
                <div className="panel-header">
                    <div className="title">{title}</div>
                    {actions && <div className="actions">{actions}</div>}
                </div>
            )}
            {children}
            {footer && <div className="panel-footer">{footer}</div>}
        </div>
    );
}

// ─── Label Value ───────────────────────────────────────────────────
function LV({ label, value, orientation = 'horizontal', children }) {
    return (
        <div className={`lv ${orientation === 'vertical' ? 'lv-vertical' : ''}`}>
            <span className="k">{label}</span>
            <span className="v">{value || children}</span>
        </div>
    );
}

// ─── Tabs ──────────────────────────────────────────────────────────
function Tabs({ items, active, onChange }) {
    return (
        <div className="tabs">
            {items.map(it => (
                <div key={it.id} className={`tab ${active === it.id ? 'active' : ''}`} onClick={() => onChange(it.id)}>
                    {it.label}
                </div>
            ))}
        </div>
    );
}

// ─── Tooltip ───────────────────────────────────────────────────────
function Tooltip({ text, children }) {
    return (
        <span className="tt-wrap">
            {children}
            <span className="tt">{text}</span>
        </span>
    );
}

// ─── Modal ─────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, footer, width }) {
    useEffect(() => {
        if (!open) return;
        const onKey = e => { if (e.key === 'Escape') onClose && onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);
    if (!open) return null;
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" style={width ? { width } : undefined} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <span className="close" onClick={onClose}><i className="fa fa-times" /></span>
                </div>
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
}

// ─── Slide-in Sidebar (right panel) ────────────────────────────────
function Sidebar({ open, onClose, title, children, footer, width = 420 }) {
    if (!open) return null;
    return (
        <>
            <div className="sidebar-backdrop" onClick={onClose} />
            <div className="sidebar" style={{ width }}>
                <div className="sidebar-header">
                    <h2>{title}</h2>
                    <span className="close" onClick={onClose} style={{ cursor: 'pointer', color: 'var(--sds-fg-subtle)' }}>
                        <i className="fa fa-times" />
                    </span>
                </div>
                <div className="sidebar-body">{children}</div>
                {footer && <div className="sidebar-footer">{footer}</div>}
            </div>
        </>
    );
}

// ─── Toast ─────────────────────────────────────────────────────────
const ToastContext = React.createContext(null);
function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const push = useCallback((toast) => {
        const id = Math.random().toString(36).slice(2);
        setToasts(t => [...t, { id, ...toast }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), toast.duration || 4000);
    }, []);
    const dismiss = id => setToasts(t => t.filter(x => x.id !== id));
    return (
        <ToastContext.Provider value={push}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`toast ${t.kind || 'info'}`}>
                        <i className={`fa lead ${
                            t.kind === 'succ' ? 'fa-check-circle' :
                            t.kind === 'warn' ? 'fa-exclamation-triangle' :
                            t.kind === 'err' ? 'fa-times-circle' : 'fa-info-circle'
                        }`} />
                        <div className="body">
                            {t.title && <b>{t.title}</b>}
                            {t.message}
                        </div>
                        <span className="x" onClick={() => dismiss(t.id)}><i className="fa fa-times" /></span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
const useToast = () => React.useContext(ToastContext);

// ─── Topbar — Structure/Topbar Property1=Default ───────────────────
// Default: module title (Inter 24, #888B99) left-aligned. No avatar
// (the avatar lives in the Navbar rail). Workspace switcher + actions
// are optional add-ons shown on the right.
function Topbar({ title = 'Title Module', workspaceTitle, workspaceSub, actions }) {
    const [wsOpen, setWsOpen] = useState(false);
    return (
        <div className="sds-topbar">
            <span className="title-module">{title}</span>
            <div className="spacer" />
            {actions}
            {workspaceTitle && (
                <div className="ws" onClick={() => setWsOpen(o => !o)}>
                    <div className="ws-content">
                        <span className="ws-title">{workspaceTitle}</span>
                        {workspaceSub && <span className="ws-sub">{workspaceSub}</span>}
                    </div>
                    <div className="ws-chevrons">
                        <i className="fa fa-chevron-up" />
                        <i className="fa fa-chevron-down" />
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Navbar (left rail) ────────────────────────────────────────────
function Navbar({ active, onNav }) {
    const items = [
        { id: 'dashboard',    icon: 'fa-th-large',       label: 'Painel' },
        { id: 'colaboradores',icon: 'fa-users',          label: 'Colaboradores' },
        { id: 'folha',        icon: 'fa-money-bill',     label: 'Folha de pagamento' },
        { id: 'ponto',        icon: 'fa-clock',          label: 'Ponto eletrônico' },
        { id: 'beneficios',   icon: 'fa-gift',           label: 'Benefícios' },
        { id: 'documentos',   icon: 'fa-file-alt',       label: 'Documentos' },
        { id: 'relatorios',   icon: 'fa-chart-bar',      label: 'Relatórios' },
    ];
    return (
        <nav className="sds-navbar">
            <div className="nav-header">
                <div className="nav-brand">
                    <span className="nav-favicon"><SeniorGlyph size={32} /></span>
                </div>
                <div className="nav-avatar">
                    <span className="avatar" style={{ margin: 0 }}>AL</span>
                </div>
            </div>
            <div className="nav-items">
                {items.map(it => (
                    <Tooltip key={it.id} text={it.label}>
                        <div className={`nav-item ${active === it.id ? 'active' : ''}`} onClick={() => onNav(it.id)}>
                            <i className={`fa ${it.icon}`} />
                        </div>
                    </Tooltip>
                ))}
            </div>
            <div className="nav-footer">
                <Tooltip text="Mais opções">
                    <div className="nav-item nav-more" onClick={() => onNav('config')}>
                        <i className="fa fa-ellipsis-h" />
                    </div>
                </Tooltip>
                <Tooltip text="Sara — assistente Senior">
                    <div className="nav-sara" />
                </Tooltip>
            </div>
        </nav>
    );
}

// ─── Stats card (Summary / Stats-card) ─────────────────────────────
// type: 'regular' (icon box) | 'color' (filled bg) | 'light' (left bar)
function Stats({ label, value, icon = 'fa-chart-bar', color = '#428BCA', type = 'regular' }) {
    if (type === 'color') {
        return (
            <div className="stat color" style={{ background: color }}>
                <div className="stat-iconbox" style={{ background: '#fff' }}>
                    <i className={`fa ${icon}`} style={{ color }} />
                </div>
                <div className="stat-txt">
                    <span className="stat-title">{label}</span>
                    <span className="stat-value">{value}</span>
                </div>
            </div>
        );
    }
    if (type === 'light') {
        return (
            <div className="stat light">
                <div className="stat-bar" style={{ background: color }} />
                <div className="stat-txt">
                    <span className="stat-title">{label}</span>
                    <span className="stat-value">{value}</span>
                </div>
            </div>
        );
    }
    return (
        <div className="stat regular">
            <div className="stat-iconbox" style={{ background: color }}>
                <i className={`fa ${icon}`} style={{ color: '#fff' }} />
            </div>
            <div className="stat-txt">
                <span className="stat-title">{label}</span>
                <span className="stat-value">{value}</span>
            </div>
        </div>
    );
}

// ─── Section title ─────────────────────────────────────────────────
function SectionTitle({ title, actions }) {
    return (
        <div className="section-title">
            <h2>{title}</h2>
            {actions && <div className="actions">{actions}</div>}
        </div>
    );
}

// Export everything to window for the other JSX file
Object.assign(window, {
    SeniorGlyph, Button, Field, Textfield, Textarea, Select,
    Checkbox, Radio, Switch, Badge, Panel, LV, Tabs, Tooltip,
    Modal, Sidebar, ToastProvider, useToast, Topbar, Navbar,
    Stats, SectionTitle
});
