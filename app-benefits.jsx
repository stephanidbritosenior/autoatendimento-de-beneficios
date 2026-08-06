/* Autoatendimento de Benefícios — app entry */

const { useState: useStateApp } = React;

function App() {
    const [route, setRoute] = useStateApp('inicial');   // inicial | colaborador | analista | notificacoes
    const [flyoutOpen, setFlyoutOpen] = useStateApp(false);
    const [notifOpen, setNotifOpen] = useStateApp(false);
    const [notifs, setNotifs] = useStateApp(NOTIFICATIONS);
    const [notifOpenId, setNotifOpenId] = useStateApp(null);
    const [colabTab, setColabTab] = useStateApp('solicitacao');
    const [colabTicketId, setColabTicketId] = useStateApp(null);
    const unreadCount = notifs.filter(n => n.unread).length;

    const selectRole = (role) => { setRoute(role); setFlyoutOpen(false); setColabTab('solicitacao'); setColabTicketId(null); };
    const goHome = () => { setRoute('inicial'); setFlyoutOpen(false); setNotifOpen(false); setColabTicketId(null); };

    const goToChamados = (notif) => {
        if (notif) setNotifs(ns => ns.map(n => n.id === notif.id ? { ...n, unread: false } : n));
        setNotifOpen(false);
        setColabTab('chamados');
        setColabTicketId(notif && notif.ticket ? notif.ticket : null);
        setRoute('colaborador');
    };

    // Bell flyout → open the full Central de Notificações page (optionally with one open).
    const openNotifCenter = (notif) => {
        if (notif) setNotifs(ns => ns.map(n => n.id === notif.id ? { ...n, unread: false } : n));
        setNotifOpen(false);
        setNotifOpenId(notif ? notif.id : null);
        setRoute('notificacoes');
    };

    const topbarActions = route === 'inicial' ? (
        <>
            <Button priority="default" auxiliary icon="fa-search">Buscar pessoas</Button>
            <Button priority="default" auxiliary icon="fa-th">Consultar padrões de design SDS</Button>
            <Button priority="default" auxiliary icon="fa-file-alt">Criar Pesquisa</Button>
        </>
    ) : null;

    const titleByRoute = {
        inicial: 'Title Module',
        colaborador: 'Gestão de Benefícios',
        analista: 'Gestão de Benefícios',
        notificacoes: 'Notificações',
    };

    return (
        <div className="app">
            <BenefitsNavbar
                active={route}
                flyoutOpen={flyoutOpen}
                onToggleFlyout={() => { setFlyoutOpen(o => !o); setNotifOpen(false); }}
                onHome={goHome}
                notifOpen={notifOpen}
                onToggleNotif={() => { setNotifOpen(o => !o); setFlyoutOpen(false); }}
                unreadCount={unreadCount}
            />
            <div className="app-main">
                <Topbar title={titleByRoute[route]} actions={topbarActions} />
                {route === 'inicial'     && <InicialScreen onOpenFlyout={() => setFlyoutOpen(true)} />}
                {route === 'colaborador' && <ColaboradorScreen key={'colab-' + colabTab + '-' + (colabTicketId || '')} initialTab={colabTab} initialTicketId={colabTicketId} onOpenFlyout={() => setFlyoutOpen(true)} />}
                {route === 'analista'    && <AnalistaScreen onOpenFlyout={() => setFlyoutOpen(true)} />}
                {route === 'notificacoes' && <NotificationCenter
                    notifs={notifs} setNotifs={setNotifs}
                    openId={notifOpenId} setOpenId={setNotifOpenId}
                    onHome={goHome} onGoChamados={goToChamados} />}
            </div>

            <RoleFlyout open={flyoutOpen} onClose={() => setFlyoutOpen(false)} onSelect={selectRole} />
            <NotificationFlyout
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                notifs={notifs}
                onOpenNotif={openNotifCenter}
                onSeeAll={() => openNotifCenter(null)}
            />
            {(route === 'colaborador' || route === 'analista') &&
                <AIAssistant key={route} role={route} />}
        </div>
    );
}

function Root() { return <ToastProvider><App /></ToastProvider>; }
ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
