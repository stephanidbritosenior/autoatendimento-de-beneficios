/* @ds-bundle: {"format":3,"namespace":"SDSWeb_a87a9e","components":[],"sourceHashes":{"ui_kits/sds-desktop/app.jsx":"218008cc9ff4","ui_kits/sds-desktop/components.jsx":"e95a63c5cf55","ui_kits/sds-desktop/screens.jsx":"d5a9256d2bf8"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SDSWeb_a87a9e = window.SDSWeb_a87a9e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/sds-desktop/app.jsx
try { (() => {
/* SDS Desktop — app entry */

const {
  useState
} = React;
function App() {
  const [route, setRoute] = useState('dashboard'); // dashboard | colaboradores | colaborador | folha | …
  const [activeNav, setActiveNav] = useState('dashboard');
  const [openColab, setOpenColab] = useState(null);
  const [newModal, setNewModal] = useState(false);
  const toast = useToast();
  const navTo = id => {
    setActiveNav(id);
    if (id === 'dashboard') setRoute('dashboard');else if (id === 'colaboradores') setRoute('colaboradores');else {
      setRoute('placeholder');
    }
  };
  const openColaborador = c => {
    setOpenColab(c);
    setRoute('colaborador');
  };
  const backToList = () => {
    setOpenColab(null);
    setRoute('colaboradores');
    setActiveNav('colaboradores');
  };
  const titleByRoute = {
    dashboard: 'Painel',
    colaboradores: 'Colaboradores',
    colaborador: openColab ? openColab.nome : 'Colaborador',
    placeholder: 'Em breve'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(Navbar, {
    active: activeNav,
    onNav: navTo
  }), /*#__PURE__*/React.createElement("div", {
    className: "app-main"
  }, /*#__PURE__*/React.createElement(Topbar, {
    title: titleByRoute[route] || 'Senior',
    workspaceTitle: "RH Brasil",
    workspaceSub: "Senior Sistemas \xB7 Matriz"
  }), route === 'dashboard' && /*#__PURE__*/React.createElement(DashboardScreen, {
    onNav: navTo
  }), route === 'colaboradores' && /*#__PURE__*/React.createElement(ColaboradoresScreen, {
    onOpen: openColaborador,
    onCreate: () => setNewModal(true)
  }), route === 'colaborador' && openColab && /*#__PURE__*/React.createElement(ColaboradorScreen, {
    colaborador: openColab,
    onBack: backToList
  }), route === 'placeholder' && /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-tools"
  })), /*#__PURE__*/React.createElement("h3", null, "M\xF3dulo em constru\xE7\xE3o"), /*#__PURE__*/React.createElement("p", null, "Este m\xF3dulo ser\xE1 migrado nos pr\xF3ximos sprints."), /*#__PURE__*/React.createElement(Button, {
    priority: "primary",
    onClick: () => navTo('dashboard')
  }, "Voltar ao painel")))), /*#__PURE__*/React.createElement(NewColaboradorModal, {
    open: newModal,
    onClose: () => setNewModal(false),
    onCreate: form => {
      setNewModal(false);
      toast({
        kind: 'succ',
        title: 'Colaborador cadastrado',
        message: `${form.nome} foi adicionado ao setor ${form.setor}.`
      });
    }
  }));
}
function Root() {
  return /*#__PURE__*/React.createElement(ToastProvider, null, /*#__PURE__*/React.createElement(App, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(Root, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sds-desktop/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sds-desktop/components.jsx
try { (() => {
/* SDS Desktop — primitive components
   Loaded via <script type="text/babel" src="components.jsx">.
   Exports to window so other JSX files can use them. */

const {
  useState,
  useRef,
  useEffect,
  useCallback
} = React;

// ─── Senior brand glyph (SVG inline; tiny) ─────────────────────────
const SeniorGlyph = ({
  size = 16
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 348 613",
  fill: "currentColor",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M174.719 518.932L258.161 439.782C264.546 433.762 269.614 426.603 273.072 418.719C276.53 410.834 278.31 402.378 278.31 393.838C278.31 385.298 276.53 376.843 273.072 368.958C269.614 361.073 264.546 353.915 258.161 347.895L174.719 269.199C168.45 263.304 163.474 256.289 160.077 248.56C156.681 240.83 154.933 232.539 154.933 224.165C154.933 215.792 156.681 207.501 160.077 199.771C163.474 192.042 168.45 185.027 174.719 179.132L303.718 301.496C329.517 326.089 344 359.371 344 394.066C344 428.76 329.517 462.043 303.718 486.635L174.719 609C168.45 603.105 163.474 596.09 160.077 588.36C156.681 580.631 154.933 572.34 154.933 563.966C154.933 555.592 156.681 547.301 160.077 539.572C163.474 531.842 168.45 524.828 174.719 518.932ZM173.76 94.0677L90.3189 173.218C83.9334 179.238 78.8659 186.397 75.408 194.281C71.95 202.166 70.1698 210.622 70.1698 219.162C70.1698 227.702 71.95 236.157 75.408 244.042C78.8659 251.927 83.9334 259.085 90.3189 265.105L173.76 344.256C180.03 350.151 185.006 357.166 188.402 364.895C191.798 372.625 193.547 380.916 193.547 389.289C193.547 397.663 191.798 405.954 188.402 413.684C185.006 421.413 180.03 428.428 173.76 434.323L44.2823 311.504C18.4832 286.911 4 253.629 4 218.934C4 184.24 18.4832 150.957 44.2823 126.365L173.76 4C186.213 16.0129 193.192 32.1861 193.192 49.0338C193.192 65.8815 186.213 82.0547 173.76 94.0677Z"
}));

// ─── Button — s-button equivalent ──────────────────────────────────
function Button({
  priority = 'primary',
  size = 'default',
  icon,
  rightIcon,
  children,
  onClick,
  disabled = false,
  auxiliary = false,
  iconOnly = false,
  type = 'button',
  className = ''
}) {
  const cls = ['btn', `btn-${priority}`, size === 'small' && 'btn-small', auxiliary && 'btn-aux', iconOnly && 'btn-icon', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    className: cls,
    disabled: disabled,
    onClick: onClick
  }, icon && /*#__PURE__*/React.createElement("i", {
    className: `fa ${icon}`,
    "aria-hidden": "true"
  }), children && /*#__PURE__*/React.createElement("span", null, children), rightIcon && /*#__PURE__*/React.createElement("i", {
    className: `fa ${rightIcon}`,
    "aria-hidden": "true"
  }));
}

// ─── Field — label + input + helper ────────────────────────────────
function Field({
  label,
  required,
  hint,
  helper,
  error,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, label && /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, " *"), hint && /*#__PURE__*/React.createElement(Tooltip, {
    text: hint
  }, /*#__PURE__*/React.createElement("span", {
    className: "hint"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-info-circle"
  })))), children, (helper || error) && /*#__PURE__*/React.createElement("div", {
    className: `helper ${error ? 'error' : ''}`
  }, error || helper));
}

// ─── Textfield ─────────────────────────────────────────────────────
function Textfield({
  value = '',
  onChange,
  placeholder,
  prefix,
  suffix,
  error,
  disabled,
  type = 'text',
  readOnly
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `input-shell ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`
  }, prefix && /*#__PURE__*/React.createElement("span", {
    className: "affix"
  }, prefix), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    readOnly: readOnly,
    onChange: e => onChange && onChange(e.target.value)
  }), suffix && /*#__PURE__*/React.createElement("span", {
    className: "affix"
  }, suffix));
}

// ─── Textarea ──────────────────────────────────────────────────────
function Textarea({
  value = '',
  onChange,
  placeholder,
  rows = 3,
  disabled,
  error
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `input-shell textarea-shell ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: rows,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.value)
  }));
}

// ─── Select — minimal dropdown ─────────────────────────────────────
function Select({
  value,
  onChange,
  options = [],
  placeholder = 'Selecione…',
  disabled,
  error
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    const onDoc = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const selected = options.find(o => o.value === value);
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `input-shell ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`,
    onClick: () => !disabled && setOpen(o => !o),
    style: {
      cursor: disabled ? 'default' : 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: selected ? 'var(--sds-fg-default)' : 'var(--sds-fg-subtle)',
      fontSize: 14
    }
  }, selected ? selected.label : placeholder), /*#__PURE__*/React.createElement("span", {
    className: "caret"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa fa-caret-${open ? 'up' : 'down'}`
  }))), open && /*#__PURE__*/React.createElement("div", {
    className: "menu",
    style: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      zIndex: 20
    }
  }, options.map(o => /*#__PURE__*/React.createElement("div", {
    key: o.value,
    className: "menu-item",
    onClick: () => {
      onChange && onChange(o.value);
      setOpen(false);
    }
  }, o.label))));
}

// ─── Checkbox / Radio / Switch ─────────────────────────────────────
function Checkbox({
  checked,
  indeterminate,
  onChange,
  children,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "cb-row",
    style: {
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `cb ${checked || indeterminate ? 'checked' : ''}`,
    onClick: () => !disabled && onChange && onChange(!checked)
  }, indeterminate ? /*#__PURE__*/React.createElement("i", {
    className: "fa fa-minus"
  }) : checked ? /*#__PURE__*/React.createElement("i", {
    className: "fa fa-check"
  }) : null), /*#__PURE__*/React.createElement("span", null, children));
}
function Radio({
  checked,
  onChange,
  children,
  name,
  value,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "rb-row",
    style: {
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `rb ${checked ? 'checked' : ''}`,
    onClick: () => !disabled && onChange && onChange(value)
  }), /*#__PURE__*/React.createElement("span", null, children));
}
function Switch({
  on,
  onChange,
  children,
  disabled
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sw-row",
    style: {
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `sw ${on ? 'on' : ''}`,
    onClick: () => !disabled && onChange && onChange(!on)
  }), children && /*#__PURE__*/React.createElement("label", {
    onClick: () => !disabled && onChange && onChange(!on)
  }, children));
}

// ─── Badge ─────────────────────────────────────────────────────────
function Badge({
  color = 'blue',
  type = 'pill',
  icon,
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `badge ${color} ${type === 'chip' ? 'chip' : ''}`
  }, icon && /*#__PURE__*/React.createElement("i", {
    className: `fa ${icon}`
  }), children);
}

// ─── Panel ─────────────────────────────────────────────────────────
function Panel({
  title,
  severity = 'default',
  actions,
  footer,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `panel severity-${severity}`
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "panel-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, title), actions && /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, actions)), children, footer && /*#__PURE__*/React.createElement("div", {
    className: "panel-footer"
  }, footer));
}

// ─── Label Value ───────────────────────────────────────────────────
function LV({
  label,
  value,
  orientation = 'horizontal',
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `lv ${orientation === 'vertical' ? 'lv-vertical' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, value || children));
}

// ─── Tabs ──────────────────────────────────────────────────────────
function Tabs({
  items,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    className: `tab ${active === it.id ? 'active' : ''}`,
    onClick: () => onChange(it.id)
  }, it.label)));
}

// ─── Tooltip ───────────────────────────────────────────────────────
function Tooltip({
  text,
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "tt-wrap"
  }, children, /*#__PURE__*/React.createElement("span", {
    className: "tt"
  }, text));
}

// ─── Modal ─────────────────────────────────────────────────────────
function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose && onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-backdrop",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    style: width ? {
      width
    } : undefined,
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h2", null, title), /*#__PURE__*/React.createElement("span", {
    className: "close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-times"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, footer)));
}

// ─── Slide-in Sidebar (right panel) ────────────────────────────────
function Sidebar({
  open,
  onClose,
  title,
  children,
  footer,
  width = 420
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-backdrop",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "sidebar",
    style: {
      width
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-header"
  }, /*#__PURE__*/React.createElement("h2", null, title), /*#__PURE__*/React.createElement("span", {
    className: "close",
    onClick: onClose,
    style: {
      cursor: 'pointer',
      color: 'var(--sds-fg-subtle)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-times"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "sidebar-footer"
  }, footer)));
}

// ─── Toast ─────────────────────────────────────────────────────────
const ToastContext = React.createContext(null);
function ToastProvider({
  children
}) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback(toast => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, {
      id,
      ...toast
    }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), toast.duration || 4000);
  }, []);
  const dismiss = id => setToasts(t => t.filter(x => x.id !== id));
  return /*#__PURE__*/React.createElement(ToastContext.Provider, {
    value: push
  }, children, /*#__PURE__*/React.createElement("div", {
    className: "toast-container"
  }, toasts.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: `toast ${t.kind || 'info'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa lead ${t.kind === 'succ' ? 'fa-check-circle' : t.kind === 'warn' ? 'fa-exclamation-triangle' : t.kind === 'err' ? 'fa-times-circle' : 'fa-info-circle'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, t.title && /*#__PURE__*/React.createElement("b", null, t.title), t.message), /*#__PURE__*/React.createElement("span", {
    className: "x",
    onClick: () => dismiss(t.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-times"
  }))))));
}
const useToast = () => React.useContext(ToastContext);

// ─── Topbar — Structure/Topbar Property1=Default ───────────────────
// Default: module title (Inter 24, #888B99) left-aligned. No avatar
// (the avatar lives in the Navbar rail). Workspace switcher + actions
// are optional add-ons shown on the right.
function Topbar({
  title = 'Title Module',
  workspaceTitle,
  workspaceSub,
  actions
}) {
  const [wsOpen, setWsOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "sds-topbar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "title-module"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "spacer"
  }), actions, workspaceTitle && /*#__PURE__*/React.createElement("div", {
    className: "ws",
    onClick: () => setWsOpen(o => !o)
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-content"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ws-title"
  }, workspaceTitle), workspaceSub && /*#__PURE__*/React.createElement("span", {
    className: "ws-sub"
  }, workspaceSub)), /*#__PURE__*/React.createElement("div", {
    className: "ws-chevrons"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-chevron-up"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fa fa-chevron-down"
  }))));
}

// ─── Navbar (left rail) ────────────────────────────────────────────
function Navbar({
  active,
  onNav
}) {
  const items = [{
    id: 'dashboard',
    icon: 'fa-th-large',
    label: 'Painel'
  }, {
    id: 'colaboradores',
    icon: 'fa-users',
    label: 'Colaboradores'
  }, {
    id: 'folha',
    icon: 'fa-money-bill',
    label: 'Folha de pagamento'
  }, {
    id: 'ponto',
    icon: 'fa-clock',
    label: 'Ponto eletrônico'
  }, {
    id: 'beneficios',
    icon: 'fa-gift',
    label: 'Benefícios'
  }, {
    id: 'documentos',
    icon: 'fa-file-alt',
    label: 'Documentos'
  }, {
    id: 'relatorios',
    icon: 'fa-chart-bar',
    label: 'Relatórios'
  }];
  return /*#__PURE__*/React.createElement("nav", {
    className: "sds-navbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-favicon"
  }, /*#__PURE__*/React.createElement(SeniorGlyph, {
    size: 32
  }))), /*#__PURE__*/React.createElement("div", {
    className: "nav-avatar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      margin: 0
    }
  }, "AL"))), /*#__PURE__*/React.createElement("div", {
    className: "nav-items"
  }, items.map(it => /*#__PURE__*/React.createElement(Tooltip, {
    key: it.id,
    text: it.label
  }, /*#__PURE__*/React.createElement("div", {
    className: `nav-item ${active === it.id ? 'active' : ''}`,
    onClick: () => onNav(it.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa ${it.icon}`
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "nav-footer"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    text: "Mais op\xE7\xF5es"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-item nav-more",
    onClick: () => onNav('config')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-ellipsis-h"
  }))), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Sara \u2014 assistente Senior"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-sara"
  }))));
}

// ─── Stats card (Summary / Stats-card) ─────────────────────────────
// type: 'regular' (icon box) | 'color' (filled bg) | 'light' (left bar)
function Stats({
  label,
  value,
  icon = 'fa-chart-bar',
  color = '#428BCA',
  type = 'regular'
}) {
  if (type === 'color') {
    return /*#__PURE__*/React.createElement("div", {
      className: "stat color",
      style: {
        background: color
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat-iconbox",
      style: {
        background: '#fff'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa ${icon}`,
      style: {
        color
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "stat-txt"
    }, /*#__PURE__*/React.createElement("span", {
      className: "stat-title"
    }, label), /*#__PURE__*/React.createElement("span", {
      className: "stat-value"
    }, value)));
  }
  if (type === 'light') {
    return /*#__PURE__*/React.createElement("div", {
      className: "stat light"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat-bar",
      style: {
        background: color
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "stat-txt"
    }, /*#__PURE__*/React.createElement("span", {
      className: "stat-title"
    }, label), /*#__PURE__*/React.createElement("span", {
      className: "stat-value"
    }, value)));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "stat regular"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-iconbox",
    style: {
      background: color
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa ${icon}`,
    style: {
      color: '#fff'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "stat-txt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stat-title"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "stat-value"
  }, value)));
}

// ─── Section title ─────────────────────────────────────────────────
function SectionTitle({
  title,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, /*#__PURE__*/React.createElement("h2", null, title), actions && /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, actions));
}

// Export everything to window for the other JSX file
Object.assign(window, {
  SeniorGlyph,
  Button,
  Field,
  Textfield,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Badge,
  Panel,
  LV,
  Tabs,
  Tooltip,
  Modal,
  Sidebar,
  ToastProvider,
  useToast,
  Topbar,
  Navbar,
  Stats,
  SectionTitle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sds-desktop/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sds-desktop/screens.jsx
try { (() => {
/* SDS Desktop — screens & sample data
   Loaded after components.jsx. */

const {
  useState,
  useMemo
} = React;

// ─── Sample data ────────────────────────────────────────────────────
const COLABORADORES = [{
  id: 1,
  nome: 'Ana Caroline Lima',
  iniciais: 'AL',
  cargo: 'Analista de RH Pleno',
  setor: 'Recursos Humanos',
  email: 'ana.lima@senior.com.br',
  status: 'ativo',
  admissao: '02/10/2021',
  salario: 'R$ 8.450,00',
  telefone: '+55 (11) 98123-4567'
}, {
  id: 2,
  nome: 'Bruno Rocha',
  iniciais: 'BR',
  cargo: 'Engenheiro de Software Sênior',
  setor: 'Tecnologia',
  email: 'bruno.rocha@senior.com.br',
  status: 'ativo',
  admissao: '14/03/2019',
  salario: 'R$ 14.200,00',
  telefone: '+55 (47) 99812-3344'
}, {
  id: 3,
  nome: 'Carla Mendes',
  iniciais: 'CM',
  cargo: 'Coord. Folha de Pagamento',
  setor: 'Financeiro',
  email: 'carla.mendes@senior.com.br',
  status: 'ferias',
  admissao: '05/06/2018',
  salario: 'R$ 11.800,00',
  telefone: '+55 (51) 98744-2210'
}, {
  id: 4,
  nome: 'Diego Souza',
  iniciais: 'DS',
  cargo: 'Estagiário',
  setor: 'Tecnologia',
  email: 'diego.souza@senior.com.br',
  status: 'desligado',
  admissao: '21/01/2024',
  salario: 'R$ 1.800,00',
  telefone: '+55 (11) 97766-1122'
}, {
  id: 5,
  nome: 'Eduarda Pinheiro',
  iniciais: 'EP',
  cargo: 'Designer de Produto',
  setor: 'Tecnologia',
  email: 'eduarda.p@senior.com.br',
  status: 'ativo',
  admissao: '11/07/2022',
  salario: 'R$ 9.700,00',
  telefone: '+55 (48) 98212-9090'
}, {
  id: 6,
  nome: 'Fernando Lobo',
  iniciais: 'FL',
  cargo: 'Diretor Comercial',
  setor: 'Comercial',
  email: 'fernando.lobo@senior.com.br',
  status: 'ativo',
  admissao: '08/02/2015',
  salario: 'R$ 28.500,00',
  telefone: '+55 (11) 99111-3232'
}, {
  id: 7,
  nome: 'Gabriela Tavares',
  iniciais: 'GT',
  cargo: 'Analista Contábil Jr.',
  setor: 'Financeiro',
  email: 'gabriela.t@senior.com.br',
  status: 'ativo',
  admissao: '16/05/2023',
  salario: 'R$ 4.300,00',
  telefone: '+55 (61) 98777-2200'
}, {
  id: 8,
  nome: 'Henrique Vidal',
  iniciais: 'HV',
  cargo: 'Gerente de Operações',
  setor: 'Operações',
  email: 'henrique.v@senior.com.br',
  status: 'afastado',
  admissao: '23/09/2020',
  salario: 'R$ 18.900,00',
  telefone: '+55 (31) 98832-1100'
}];
const STATUS_MAP = {
  ativo: {
    color: 'green',
    icon: 'fa-check',
    label: 'Ativo'
  },
  ferias: {
    color: 'yellow',
    icon: null,
    label: 'Férias'
  },
  afastado: {
    color: 'blue',
    icon: null,
    label: 'Afastado'
  },
  desligado: {
    color: 'red',
    icon: null,
    label: 'Desligado'
  }
};

// ─── Dashboard ──────────────────────────────────────────────────────
function DashboardScreen({
  onNav
}) {
  const toast = useToast();
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Bom dia, Ana"), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "Aqui est\xE1 o resumo do RH hoje, 28 de maio de 2026.")), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement(Button, {
    priority: "default",
    icon: "fa-download"
  }, "Exportar"), /*#__PURE__*/React.createElement(Button, {
    priority: "primary",
    icon: "fa-plus",
    onClick: () => onNav('colaboradores')
  }, "Novo colaborador"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-4 mb-16"
  }, /*#__PURE__*/React.createElement(Stats, {
    label: "Colaboradores ativos",
    value: "187",
    icon: "fa-users",
    color: "#0C9348",
    type: "regular"
  }), /*#__PURE__*/React.createElement(Stats, {
    label: "Em f\xE9rias",
    value: "12",
    icon: "fa-umbrella-beach",
    color: "#F8931F",
    type: "light"
  }), /*#__PURE__*/React.createElement(Stats, {
    label: "Folha do m\xEAs",
    value: "R$ 1,42 M",
    icon: "fa-money-bill-wave",
    color: "#428BCA",
    type: "color"
  }), /*#__PURE__*/React.createElement(Stats, {
    label: "Turnover (12m)",
    value: "6,8%",
    icon: "fa-arrow-trend-down",
    color: "#C13018",
    type: "regular"
  })), /*#__PURE__*/React.createElement(SectionTitle, {
    title: "Pend\xEAncias",
    actions: /*#__PURE__*/React.createElement(Button, {
      priority: "tertiary",
      rightIcon: "fa-arrow-right"
    }, "Ver todas")
  }), /*#__PURE__*/React.createElement(Panel, {
    severity: "warn",
    title: "2 documentos vencendo em 30 dias"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar"
  }, "CM"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700
    }
  }, "Carla Mendes \xB7 ASO peri\xF3dico"), /*#__PURE__*/React.createElement("div", {
    className: "subtle"
  }, "Vence em 18 dias \xB7 Coord. Folha de Pagamento")), /*#__PURE__*/React.createElement(Badge, {
    color: "orange",
    icon: "fa-exclamation-triangle"
  }, "Atrasado"), /*#__PURE__*/React.createElement(Button, {
    priority: "tertiary",
    size: "small"
  }, "Resolver")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar"
  }, "HV"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700
    }
  }, "Henrique Vidal \xB7 Atestado m\xE9dico"), /*#__PURE__*/React.createElement("div", {
    className: "subtle"
  }, "Vence em 27 dias \xB7 Gerente de Opera\xE7\xF5es")), /*#__PURE__*/React.createElement(Badge, {
    color: "yellow"
  }, "Pendente"), /*#__PURE__*/React.createElement(Button, {
    priority: "tertiary",
    size: "small"
  }, "Resolver")))), /*#__PURE__*/React.createElement(Panel, {
    title: "Atividade recente"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, [{
    who: 'EP',
    t: 'Eduarda Pinheiro foi promovida para Designer de Produto Sr.',
    when: '2h'
  }, {
    who: 'AL',
    t: 'Você atualizou os dados bancários de Ana Caroline Lima',
    when: '4h'
  }, {
    who: 'BR',
    t: 'Bruno Rocha enviou solicitação de férias para julho',
    when: 'ontem'
  }, {
    who: 'FL',
    t: 'Fernando Lobo aprovou 3 reembolsos do Comercial',
    when: 'ontem'
  }].map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 0',
      borderBottom: i < 3 ? '1px solid var(--sds-bg-hover)' : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar"
  }, a.who), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 13
    }
  }, a.t), /*#__PURE__*/React.createElement("span", {
    className: "subtle"
  }, a.when))))));
}

// ─── Colaboradores list ─────────────────────────────────────────────
function ColaboradoresScreen({
  onOpen,
  onCreate
}) {
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSetor, setFilterSetor] = useState('');
  const [selected, setSelected] = useState(new Set());
  const rows = useMemo(() => COLABORADORES.filter(c => (!query || c.nome.toLowerCase().includes(query.toLowerCase()) || c.cargo.toLowerCase().includes(query.toLowerCase())) && (!filterStatus || c.status === filterStatus) && (!filterSetor || c.setor === filterSetor)), [query, filterStatus, filterSetor]);
  const toggle = id => {
    const ns = new Set(selected);
    ns.has(id) ? ns.delete(id) : ns.add(id);
    setSelected(ns);
  };
  const allSelected = rows.length > 0 && rows.every(r => selected.has(r.id));
  const someSelected = !allSelected && rows.some(r => selected.has(r.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());else setSelected(new Set(rows.map(r => r.id)));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Colaboradores"), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, rows.length, " de ", COLABORADORES.length, " colaboradores")), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement(Button, {
    priority: "default",
    icon: "fa-download"
  }, "Exportar CSV"), /*#__PURE__*/React.createElement(Button, {
    priority: "primary",
    icon: "fa-plus",
    onClick: onCreate
  }, "Novo colaborador"))), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-16",
    style: {
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 2
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Buscar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "input-shell"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-search affix"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Nome, cargo, e-mail\u2026",
    value: query,
    onChange: e => setQuery(e.target.value)
  }), query && /*#__PURE__*/React.createElement("i", {
    className: "fa fa-times affix",
    style: {
      cursor: 'pointer'
    },
    onClick: () => setQuery('')
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Status"
  }, /*#__PURE__*/React.createElement(Select, {
    value: filterStatus,
    onChange: setFilterStatus,
    options: [{
      value: '',
      label: 'Todos os status'
    }, {
      value: 'ativo',
      label: 'Ativo'
    }, {
      value: 'ferias',
      label: 'Férias'
    }, {
      value: 'afastado',
      label: 'Afastado'
    }, {
      value: 'desligado',
      label: 'Desligado'
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Setor"
  }, /*#__PURE__*/React.createElement(Select, {
    value: filterSetor,
    onChange: setFilterSetor,
    options: [{
      value: '',
      label: 'Todos os setores'
    }, {
      value: 'Recursos Humanos',
      label: 'Recursos Humanos'
    }, {
      value: 'Tecnologia',
      label: 'Tecnologia'
    }, {
      value: 'Financeiro',
      label: 'Financeiro'
    }, {
      value: 'Comercial',
      label: 'Comercial'
    }, {
      value: 'Operações',
      label: 'Operações'
    }]
  })))), selected.size > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-16",
    style: {
      background: 'var(--sds-badge-blue-bg)',
      border: '1px solid var(--sds-badge-blue-border)',
      padding: '10px 14px',
      borderRadius: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("b", null, selected.size, " selecionado", selected.size > 1 ? 's' : ''), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }), /*#__PURE__*/React.createElement(Button, {
    priority: "tertiary",
    size: "small",
    icon: "fa-envelope"
  }, "Enviar mensagem"), /*#__PURE__*/React.createElement(Button, {
    priority: "tertiary",
    size: "small",
    icon: "fa-file-export"
  }, "Exportar"), /*#__PURE__*/React.createElement(Button, {
    priority: "default",
    size: "small",
    onClick: () => setSelected(new Set())
  }, "Limpar sele\xE7\xE3o")), /*#__PURE__*/React.createElement("div", {
    className: "mt-16",
    style: {
      overflow: 'auto',
      margin: '16px -20px -20px',
      borderTop: '1px solid var(--sds-border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "sds-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 40,
      padding: '10px 0 10px 20px'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: allSelected,
    indeterminate: someSelected,
    onChange: toggleAll
  }, /*#__PURE__*/React.createElement("span", null))), /*#__PURE__*/React.createElement("th", {
    className: "sortable"
  }, "Colaborador ", /*#__PURE__*/React.createElement("i", {
    className: "fa fa-arrow-down sortarrow"
  })), /*#__PURE__*/React.createElement("th", {
    className: "sortable"
  }, "Cargo"), /*#__PURE__*/React.createElement("th", {
    className: "sortable"
  }, "Setor"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "sortable"
  }, "Admiss\xE3o"), /*#__PURE__*/React.createElement("th", {
    style: {
      width: 100,
      textAlign: 'right',
      paddingRight: 20
    }
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => {
    const s = STATUS_MAP[r.status];
    return /*#__PURE__*/React.createElement("tr", {
      key: r.id,
      className: selected.has(r.id) ? 'selected' : '',
      onClick: () => onOpen(r)
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '10px 0 10px 20px'
      },
      onClick: e => {
        e.stopPropagation();
        toggle(r.id);
      }
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: selected.has(r.id),
      onChange: () => toggle(r.id)
    }, /*#__PURE__*/React.createElement("span", null))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "avatar"
    }, r.iniciais), /*#__PURE__*/React.createElement("span", {
      style: {
        verticalAlign: 'middle'
      }
    }, r.nome)), /*#__PURE__*/React.createElement("td", null, r.cargo), /*#__PURE__*/React.createElement("td", null, r.setor), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
      color: s.color,
      icon: s.icon
    }, s.label)), /*#__PURE__*/React.createElement("td", null, r.admissao), /*#__PURE__*/React.createElement("td", {
      className: "actions-cell",
      style: {
        textAlign: 'right',
        paddingRight: 20
      },
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-pencil",
      title: "Editar"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa fa-ellipsis-v",
      title: "Mais"
    })));
  }), rows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 7
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-search"
  })), /*#__PURE__*/React.createElement("h3", null, "Nenhum colaborador encontrado"), /*#__PURE__*/React.createElement("p", null, "Tente ajustar os filtros ou limpe a busca."), /*#__PURE__*/React.createElement(Button, {
    priority: "tertiary",
    onClick: () => {
      setQuery('');
      setFilterStatus('');
      setFilterSetor('');
    }
  }, "Limpar filtros")))))))));
}

// ─── Colaborador detail ─────────────────────────────────────────────
function ColaboradorScreen({
  colaborador,
  onBack
}) {
  const [tab, setTab] = useState('dados');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nome: colaborador.nome,
    email: colaborador.email.split('@')[0],
    cargo: colaborador.cargo,
    setor: colaborador.setor,
    telefone: colaborador.telefone,
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    nascimento: '15/03/1990',
    ativo: colaborador.status === 'ativo',
    notif: true,
    recebeNovidades: false
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toast = useToast();
  const s = STATUS_MAP[colaborador.status];
  const save = () => {
    setEditing(false);
    toast({
      kind: 'succ',
      title: 'Dados salvos',
      message: 'As alterações de ' + form.nome + ' foram registradas.'
    });
  };
  const f = (k, v) => setForm(p => ({
    ...p,
    [k]: v
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      id: 'dados',
      label: 'Dados pessoais'
    }, {
      id: 'vinculo',
      label: 'Vínculo'
    }, {
      id: 'documentos',
      label: 'Documentos'
    }, {
      id: 'historico',
      label: 'Histórico'
    }],
    active: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar lg"
  }, colaborador.iniciais), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      marginBottom: 6
    }
  }, colaborador.nome), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    },
    className: "sub"
  }, colaborador.cargo, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--sds-grayscale-30)'
    }
  }, "\u2022"), colaborador.setor, /*#__PURE__*/React.createElement(Badge, {
    color: s.color,
    icon: s.icon
  }, s.label)))), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement(Button, {
    priority: "default",
    icon: "fa-arrow-left",
    onClick: onBack
  }, "Voltar"), !editing ? /*#__PURE__*/React.createElement(Button, {
    priority: "primary",
    icon: "fa-pencil",
    onClick: () => setEditing(true)
  }, "Editar") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    priority: "tertiary",
    onClick: () => setEditing(false)
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    priority: "primary",
    icon: "fa-save",
    onClick: save
  }, "Salvar")))), tab === 'dados' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Panel, {
    title: "Dados pessoais",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, {
      text: "Marcar como favorito"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-star-o"
    })), /*#__PURE__*/React.createElement("i", {
      className: "fa fa-ellipsis-v"
    }))
  }, !editing ? /*#__PURE__*/React.createElement("div", {
    className: "grid grid-3 gap-16"
  }, /*#__PURE__*/React.createElement(LV, {
    label: "Nome",
    value: form.nome,
    orientation: "vertical"
  }), /*#__PURE__*/React.createElement(LV, {
    label: "E-mail",
    value: form.email + '@senior.com.br',
    orientation: "vertical"
  }), /*#__PURE__*/React.createElement(LV, {
    label: "Telefone",
    value: form.telefone,
    orientation: "vertical"
  }), /*#__PURE__*/React.createElement(LV, {
    label: "CPF",
    value: form.cpf,
    orientation: "vertical"
  }), /*#__PURE__*/React.createElement(LV, {
    label: "RG",
    value: form.rg,
    orientation: "vertical"
  }), /*#__PURE__*/React.createElement(LV, {
    label: "Nascimento",
    value: form.nascimento,
    orientation: "vertical"
  })) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-2 gap-16"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Nome completo",
    required: true
  }, /*#__PURE__*/React.createElement(Textfield, {
    value: form.nome,
    onChange: v => f('nome', v)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "E-mail corporativo",
    required: true
  }, /*#__PURE__*/React.createElement(Textfield, {
    value: form.email,
    onChange: v => f('email', v),
    suffix: "@senior.com.br"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Telefone"
  }, /*#__PURE__*/React.createElement(Textfield, {
    value: form.telefone,
    onChange: v => f('telefone', v)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "CPF",
    required: true
  }, /*#__PURE__*/React.createElement(Textfield, {
    value: form.cpf,
    onChange: v => f('cpf', v)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "RG"
  }, /*#__PURE__*/React.createElement(Textfield, {
    value: form.rg,
    onChange: v => f('rg', v)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Data de nascimento",
    required: true
  }, /*#__PURE__*/React.createElement(Textfield, {
    value: form.nascimento,
    onChange: v => f('nascimento', v)
  })))), /*#__PURE__*/React.createElement(Panel, {
    title: "V\xEDnculo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-3 gap-16"
  }, /*#__PURE__*/React.createElement(LV, {
    label: "Cargo",
    value: form.cargo,
    orientation: "vertical"
  }), /*#__PURE__*/React.createElement(LV, {
    label: "Setor",
    value: form.setor,
    orientation: "vertical"
  }), /*#__PURE__*/React.createElement(LV, {
    label: "Admiss\xE3o",
    value: colaborador.admissao,
    orientation: "vertical"
  }), /*#__PURE__*/React.createElement(LV, {
    label: "Sal\xE1rio",
    value: colaborador.salario,
    orientation: "vertical"
  }), /*#__PURE__*/React.createElement(LV, {
    label: "Tipo de contrato",
    value: "CLT \u2014 integral",
    orientation: "vertical"
  }), /*#__PURE__*/React.createElement(LV, {
    label: "Centro de custo",
    value: "100-RH-BR",
    orientation: "vertical"
  }))), /*#__PURE__*/React.createElement(Panel, {
    title: "Prefer\xEAncias"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    on: form.ativo,
    onChange: v => f('ativo', v)
  }, "Colaborador ativo"), /*#__PURE__*/React.createElement(Switch, {
    on: form.notif,
    onChange: v => f('notif', v)
  }, "Receber notifica\xE7\xF5es de folha"), /*#__PURE__*/React.createElement(Switch, {
    on: form.recebeNovidades,
    onChange: v => f('recebeNovidades', v)
  }, "Receber e-mails de novidades"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    priority: "danger",
    icon: "fa-trash",
    onClick: () => setConfirmOpen(true)
  }, "Desligar colaborador"))), tab === 'vinculo' && /*#__PURE__*/React.createElement(Panel, {
    title: "Hist\xF3rico de cargos"
  }, /*#__PURE__*/React.createElement(Timeline, null)), tab === 'documentos' && /*#__PURE__*/React.createElement(Panel, {
    title: "Documentos"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-file-alt"
  })), /*#__PURE__*/React.createElement("h3", null, "Nenhum documento anexado"), /*#__PURE__*/React.createElement("p", null, "Arraste arquivos ou clique abaixo para adicionar."), /*#__PURE__*/React.createElement(Button, {
    priority: "primary",
    icon: "fa-plus"
  }, "Adicionar documento"))), tab === 'historico' && /*#__PURE__*/React.createElement(Panel, {
    title: "Auditoria"
  }, /*#__PURE__*/React.createElement(Timeline, null))), /*#__PURE__*/React.createElement(Modal, {
    open: confirmOpen,
    onClose: () => setConfirmOpen(false),
    title: "Desligar colaborador?",
    width: 440,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      priority: "tertiary",
      onClick: () => setConfirmOpen(false)
    }, "Cancelar"), /*#__PURE__*/React.createElement("div", {
      className: "right"
    }, /*#__PURE__*/React.createElement(Button, {
      priority: "danger",
      icon: "fa-trash",
      onClick: () => {
        setConfirmOpen(false);
        toast({
          kind: 'warn',
          title: 'Colaborador desligado',
          message: form.nome + ' foi movido para o histórico.'
        });
        onBack();
      }
    }, "Desligar")))
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--sds-fg-default)'
    }
  }, "Esta a\xE7\xE3o registrar\xE1 ", /*#__PURE__*/React.createElement("b", null, form.nome), " como desligado e revogar\xE1 seus acessos. O hist\xF3rico permanece dispon\xEDvel para auditoria."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 12,
      color: 'var(--sds-fg-muted)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-info-circle",
    style: {
      marginRight: 6,
      color: 'var(--sds-primary)'
    }
  }), "Esta a\xE7\xE3o n\xE3o poder\xE1 ser desfeita pelo gestor \u2014 apenas pelo administrador do sistema.")));
}
function Timeline() {
  const events = [{
    dot: 'green',
    title: 'Promoção: Designer de Produto Sr.',
    who: 'Aprovada por Fernando Lobo',
    when: '15 mai 2026 · 14:30'
  }, {
    dot: 'blue',
    title: 'Alteração de salário',
    who: 'R$ 8.450 → R$ 9.700',
    when: '15 mai 2026 · 14:31'
  }, {
    dot: 'gray',
    title: 'Mudança de centro de custo',
    who: '200-DSGN-BR',
    when: '14 mai 2026 · 09:12'
  }, {
    dot: 'gray',
    title: 'Renovação anual de contrato',
    who: 'Período 2025-2026',
    when: '02 out 2025 · 10:00'
  }, {
    dot: 'gray',
    title: 'Admissão',
    who: 'CLT integral · Tecnologia',
    when: '02 out 2021 · 09:00'
  }];
  const colorMap = {
    green: '#0C9348',
    blue: '#428BCA',
    gray: '#C1C1CC'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      paddingLeft: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 7,
      top: 8,
      bottom: 8,
      width: 1,
      background: 'var(--sds-border-subtle)'
    }
  }), events.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 16,
      padding: '10px 0',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 14,
      height: 14,
      borderRadius: 7,
      background: '#fff',
      border: `2px solid ${colorMap[e.dot]}`,
      position: 'absolute',
      left: -20,
      top: 14
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, e.title), /*#__PURE__*/React.createElement("div", {
    className: "subtle"
  }, e.who)), /*#__PURE__*/React.createElement("div", {
    className: "subtle",
    style: {
      whiteSpace: 'nowrap'
    }
  }, e.when))));
}

// ─── New-colaborador modal ──────────────────────────────────────────
function NewColaboradorModal({
  open,
  onClose,
  onCreate
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    cargo: '',
    setor: 'Tecnologia',
    tipo: 'clt'
  });
  const reset = () => {
    setStep(0);
    setForm({
      nome: '',
      email: '',
      cargo: '',
      setor: 'Tecnologia',
      tipo: 'clt'
    });
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: () => {
      onClose();
      reset();
    },
    title: "Novo colaborador",
    width: 560,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      priority: "tertiary",
      onClick: () => {
        onClose();
        reset();
      }
    }, "Cancelar"), /*#__PURE__*/React.createElement("div", {
      className: "right"
    }, step > 0 && /*#__PURE__*/React.createElement(Button, {
      priority: "default",
      onClick: () => setStep(s => s - 1)
    }, "Anterior"), step < 1 ? /*#__PURE__*/React.createElement(Button, {
      priority: "primary",
      rightIcon: "fa-arrow-right",
      onClick: () => setStep(s => s + 1),
      disabled: !form.nome || !form.email
    }, "Pr\xF3ximo") : /*#__PURE__*/React.createElement(Button, {
      priority: "primary",
      icon: "fa-check",
      onClick: () => {
        onCreate(form);
        reset();
      }
    }, "Concluir")))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      marginBottom: 20
    }
  }, [0, 1].map(i => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 14,
      background: step >= i ? 'var(--sds-primary)' : '#fff',
      border: `2px solid ${step >= i ? 'var(--sds-primary)' : 'var(--sds-border-default)'}`,
      color: step >= i ? '#fff' : 'var(--sds-fg-subtle)',
      fontSize: 12,
      fontWeight: 700,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, step > i ? /*#__PURE__*/React.createElement("i", {
    className: "fa fa-check"
  }) : i + 1), i === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 2,
      background: step > 0 ? 'var(--sds-primary)' : 'var(--sds-border-default)',
      margin: '0 8px'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 12,
      fontSize: 13,
      color: 'var(--sds-fg-muted)'
    }
  }, "Passo ", step + 1, " de 2 \u2014 ", step === 0 ? 'Dados pessoais' : 'Vínculo')), step === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Nome completo",
    required: true
  }, /*#__PURE__*/React.createElement(Textfield, {
    value: form.nome,
    onChange: v => setForm({
      ...form,
      nome: v
    }),
    placeholder: "Ex: Maria Silva"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "E-mail corporativo",
    required: true
  }, /*#__PURE__*/React.createElement(Textfield, {
    value: form.email,
    onChange: v => setForm({
      ...form,
      email: v
    }),
    placeholder: "maria.silva",
    suffix: "@senior.com.br"
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Cargo"
  }, /*#__PURE__*/React.createElement(Textfield, {
    value: form.cargo,
    onChange: v => setForm({
      ...form,
      cargo: v
    }),
    placeholder: "Ex: Analista Pleno"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Setor",
    required: true
  }, /*#__PURE__*/React.createElement(Select, {
    value: form.setor,
    onChange: v => setForm({
      ...form,
      setor: v
    }),
    options: [{
      value: 'Recursos Humanos',
      label: 'Recursos Humanos'
    }, {
      value: 'Tecnologia',
      label: 'Tecnologia'
    }, {
      value: 'Financeiro',
      label: 'Financeiro'
    }, {
      value: 'Comercial',
      label: 'Comercial'
    }, {
      value: 'Operações',
      label: 'Operações'
    }]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Tipo de contrato",
    required: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-16",
    style: {
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement(Radio, {
    checked: form.tipo === 'clt',
    onChange: () => setForm({
      ...form,
      tipo: 'clt'
    }),
    value: "clt"
  }, "CLT"), /*#__PURE__*/React.createElement(Radio, {
    checked: form.tipo === 'pj',
    onChange: () => setForm({
      ...form,
      tipo: 'pj'
    }),
    value: "pj"
  }, "PJ"), /*#__PURE__*/React.createElement(Radio, {
    checked: form.tipo === 'estag',
    onChange: () => setForm({
      ...form,
      tipo: 'estag'
    }),
    value: "estag"
  }, "Est\xE1gio")))));
}

// Export
Object.assign(window, {
  DashboardScreen,
  ColaboradoresScreen,
  ColaboradorScreen,
  NewColaboradorModal,
  COLABORADORES,
  STATUS_MAP
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sds-desktop/screens.jsx", error: String((e && e.message) || e) }); }

})();
