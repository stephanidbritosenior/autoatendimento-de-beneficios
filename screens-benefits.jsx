/* Autoatendimento de Benefícios — screens
   Loaded after benefits.jsx. Exports to window. */

const { useState: useStateS } = React;

/* ─── Central de Notificações (full page) ─── */
function NotificationCenter({ notifs, setNotifs, openId, setOpenId, onHome, onGoChamados }) {
    const [tab, setTab] = useStateS('notificacoes');
    const [filtrosOpen, setFiltrosOpen] = useStateS(true);
    const [sel, setSel] = useStateS([]); // selected ids (checkboxes)

    const open = openId ? notifs.find(n => n.id === openId) : null;
    const mark = (ids, unread) => setNotifs(ns => ns.map(n => ids.includes(n.id) ? { ...n, unread } : n));
    const remove = (ids) => { setNotifs(ns => ns.filter(n => !ids.includes(n.id))); setSel(s => s.filter(x => !ids.includes(x))); };
    const toggle = (id) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    const allSel = notifs.length > 0 && sel.length === notifs.length;

    /* ── Detail view ── */
    if (open) {
        return (
            <div className="app-main-inner">
                <div className="bx-header bx-divider">
                    <h1>Notificações</h1>
                    <Breadcrumb onHome={onHome} items={[{ label: 'Notificações', onClick: () => setOpenId(null) }, { label: open.title }]} />
                </div>
                <div className="bx-body ntf-page">
                    <Panel title="Todas as notificações">
                        <Tabs items={[{ id: 'notificacoes', label: 'Notificações' }, { id: 'config', label: 'Configurações' }]} active="notificacoes" onChange={() => {}} />
                        <div className="ntf-detail">
                            <h2 className="ntf-d-title">{open.title}</h2>
                            <div className="ntf-d-body">
                                <p>{open.sub}</p>
                                <p>{open.body}</p>
                                {open.ticket && <p>Protocolo relacionado: <b>{open.ticket}</b></p>}
                            </div>
                            <div className="ntf-d-meta">
                                <div><span className="ntf-d-k">Origem</span><span className="ntf-d-v">{open.origem}</span></div>
                                <div><span className="ntf-d-k">Tipo</span><span className="ntf-d-v">{open.tipo}</span></div>
                                <div><span className="ntf-d-k">Data/Hora</span><span className="ntf-d-v">{open.data}</span></div>
                            </div>
                            {open.ticket && (
                                <div className="ntf-d-cta">
                                    <Button priority="primary" icon="fa-headset" onClick={() => onGoChamados(open)}>Ir para acompanhamento de chamados</Button>
                                </div>
                            )}
                            <div className="ntf-d-actions">
                                <Button priority="primary" onClick={() => mark([open.id], !open.unread)}>{open.unread ? 'Marcar como lida' : 'Marcar como não lida'}</Button>
                                <Button priority="default" onClick={() => setOpenId(null)}>Voltar</Button>
                                <Button priority="tertiary" icon="fa-trash" onClick={() => { remove([open.id]); setOpenId(null); }}>Excluir</Button>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        );
    }

    /* ── List view ── */
    return (
        <div className="app-main-inner">
            <div className="bx-header bx-divider">
                <h1>Notificações</h1>
                <Breadcrumb onHome={onHome} items={[{ label: 'Notificações' }]} />
            </div>
            <div className="bx-body ntf-page">
                <Panel
                    title="Filtros"
                    actions={<i className={`fa fa-${filtrosOpen ? 'minus' : 'plus'}`} onClick={() => setFiltrosOpen(o => !o)} style={{ cursor: 'pointer' }} />}
                >
                    {filtrosOpen && (
                        <div className="grid grid-3 gap-16">
                            <Field label="Assunto"><Textfield placeholder="Buscar por assunto" /></Field>
                            <Field label="Origem"><Select placeholder="Todas as origens" options={[{ value: 'beneficios', label: 'Gestão de Benefícios' }, { value: 'workflow', label: 'Workflow' }]} /></Field>
                            <Field label="Situação"><Select placeholder="Todas" options={[{ value: 'unread', label: 'Não lidas' }, { value: 'read', label: 'Lidas' }]} /></Field>
                        </div>
                    )}
                </Panel>

                <Panel title="Todas as notificações">
                    <Tabs items={[{ id: 'notificacoes', label: 'Notificações' }, { id: 'config', label: 'Configurações' }]} active={tab} onChange={setTab} />

                    {tab === 'notificacoes' && (
                        <>
                            <div className="ntf-actions">
                                <Button priority="primary" disabled={sel.length === 0} onClick={() => { mark(sel, false); setSel([]); }}>Marcar como lida</Button>
                                <Button priority="default" disabled={sel.length === 0} onClick={() => { mark(sel, true); setSel([]); }}>Marcar como não lida</Button>
                                <Button priority="tertiary" icon="fa-trash" disabled={sel.length === 0} onClick={() => remove(sel)}>Excluir</Button>
                            </div>

                            <div className="ntf-table-wrap">
                                <table className="ntf-table">
                                    <thead>
                                        <tr>
                                            <th className="ntf-cb"><Checkbox checked={allSel} indeterminate={sel.length > 0 && !allSel} onChange={() => setSel(allSel ? [] : notifs.map(n => n.id))} /></th>
                                            <th>Assunto</th>
                                            <th>Conteúdo</th>
                                            <th>Origem</th>
                                            <th>Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notifs.map(n => (
                                            <tr key={n.id} className={`${sel.includes(n.id) ? 'row-sel' : ''} ${n.unread ? 'row-unread' : ''}`}
                                                onClick={() => { mark([n.id], false); setOpenId(n.id); }}>
                                                <td className="ntf-cb" onClick={e => e.stopPropagation()}><Checkbox checked={sel.includes(n.id)} onChange={() => toggle(n.id)} /></td>
                                                <td className="ntf-assunto">{n.unread && <span className="ntf-undot" />}{n.title}</td>
                                                <td className="ntf-conteudo"><span className="ntf-c-1">{n.sub}</span><span className="ntf-c-2">{n.preview}</span></td>
                                                <td className="ntf-origem">{n.origem}</td>
                                                <td className="ntf-data">{(n.data || '').split(' às ')[0]}</td>
                                            </tr>
                                        ))}
                                        {notifs.length === 0 && (
                                            <tr><td colSpan={5} className="ntf-empty">Nenhuma notificação encontrada.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="ntf-pager">
                                <div className="ntf-pager-nav">
                                    <button disabled><i className="fa fa-angle-double-left" /></button>
                                    <button disabled><i className="fa fa-angle-left" /></button>
                                    <button className="ntf-page-cur">1</button>
                                    <button disabled><i className="fa fa-angle-right" /></button>
                                    <button disabled><i className="fa fa-angle-double-right" /></button>
                                    <span className="ntf-pagesize">10 <i className="fa fa-chevron-down" /></span>
                                </div>
                                <span className="ntf-count">{notifs.length} registro{notifs.length !== 1 ? 's' : ''} encontrado{notifs.length !== 1 ? 's' : ''}</span>
                            </div>
                        </>
                    )}

                    {tab === 'config' && (
                        <div className="ntf-config">
                            <p className="ntf-config-lead">Escolha quais notificações deseja receber sobre seus benefícios.</p>
                            {[
                                ['Mensagens do RH', 'Receba avisos quando o RH responder seus chamados.'],
                                ['Andamento de solicitações', 'Acompanhe mudanças de status das suas solicitações.'],
                                ['Conclusão de chamados', 'Seja avisado quando um chamado for concluído.'],
                                ['Pendências de documentos', 'Lembretes sobre documentos que faltam enviar.'],
                            ].map(([t, s], i) => (
                                <div className="ntf-config-row" key={i}>
                                    <div><div className="ntf-config-t">{t}</div><div className="ntf-config-s">{s}</div></div>
                                    <Switch on={i !== 3} onChange={() => {}} />
                                </div>
                            ))}
                        </div>
                    )}
                </Panel>
            </div>
        </div>
    );
}

/* ─── Initial page (painel inicial: Filtros + Resultados) ─── */
function InicialScreen({ onOpenFlyout }) {
    const [filtrosOpen, setFiltrosOpen] = useStateS(true);
    const [form, setForm] = useStateS({ nome: '', categoria: '', email: '', codigo: '' });
    const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

    return (
        <div className="bx-body">
            <div className="page-header" style={{ marginBottom: 16 }}>
                <div>
                    <h1 style={{ font: '400 24px/1.5 "Inter", var(--sds-font-family)', margin: 0, color: 'var(--sds-fg-default)' }}>Módulo</h1>
                    <Breadcrumb onHome={() => {}} items={[
                        { label: 'Nome do produto', onClick: () => {} },
                        { label: 'Nome do módulo', onClick: () => {} },
                        { label: 'Nome da página' },
                    ]} />
                </div>
            </div>

            <Panel
                title="Filtros"
                actions={<i className={`fa fa-${filtrosOpen ? 'minus' : 'plus'}`} onClick={() => setFiltrosOpen(o => !o)} style={{ cursor: 'pointer' }} />}
            >
                {filtrosOpen && (
                    <>
                        <div className="grid grid-4 gap-16">
                            <Field label="Nome">
                                <Textfield value={form.nome} onChange={v => f('nome', v)} placeholder="Digite o nome" />
                            </Field>
                            <Field label="Categoria" required hint="Selecione a categoria desejada" helper="Selecione a categoria desejada">
                                <Select value={form.categoria} onChange={v => f('categoria', v)}
                                    placeholder="Selecione uma categoria"
                                    options={[
                                        { value: 'beneficios', label: 'Benefícios' },
                                        { value: 'saude', label: 'Saúde' },
                                        { value: 'transporte', label: 'Transporte' },
                                    ]} />
                            </Field>
                            <Field label="Email">
                                <Textfield value={form.email} onChange={v => f('email', v)} placeholder="Digite o email" />
                            </Field>
                            <Field label="Código">
                                <Textfield value={form.codigo} onChange={v => f('codigo', v)} placeholder="Digite o código"
                                    prefix={<i className="fa fa-rocket" />} />
                            </Field>
                        </div>
                        <div className="flex gap-16 mt-16" style={{ alignItems: 'center' }}>
                            <Button priority="primary">Buscar resultados</Button>
                            <Button priority="tertiary" onClick={() => setForm({ nome: '', categoria: '', email: '', codigo: '' })}>Limpar campos</Button>
                        </div>
                    </>
                )}
            </Panel>

            <Panel title="Resultados">
                <div className="grid grid-3 gap-16">
                    <LV label="Satisfação Média" value="88.5%" orientation="vertical" />
                    <LV label="Taxa de Erro Média" value="3.0%" orientation="vertical" />
                    <LV label="Tempo Resposta Médio" value="1.6s" orientation="vertical" />
                </div>
            </Panel>
        </div>
    );
}

/* ─── Shared communication panel (RH ↔ Colaborador), persisted per protocol ─── */
function nowStampBR() {
    const dt = new Date();
    const p = n => String(n).padStart(2, '0');
    return `${p(dt.getDate())}/${p(dt.getMonth() + 1)}/${dt.getFullYear()} ${p(dt.getHours())}:${p(dt.getMinutes())}`;
}
function initialsOf(name) { return name.split(' ').map(n => n[0]).slice(0, 2).join(''); }

const DEMO_REPLY = {
    rh: 'Obrigada pelo retorno! Já validei o comprovante enviado e vou concluir a alteração no próximo processamento da folha.',
    colaborador: 'Oi! Segue o comprovante atualizado com a data legível. Qualquer outra informação, me avise.',
};

function CommunicationPanel({ storeKey, seed, role, rhName, colabName, forceClosed, forceClosedNote }) {
    /* Protótipo de demonstração: a conversa reinicia a cada entrada na tela. */
    const [thread, setThread] = useStateS(seed || []);
    const [comment, setComment] = useStateS('');
    const [attach, setAttach] = useStateS(null);
    const [closed, setClosed] = useStateS(false);
    const [rating, setRating] = useStateS(0);
    const toast = useToast();

    const persist = () => {};
    const isClosed = closed || !!forceClosed;
    const rhStarted = thread.some(m => m.papel === 'rh');
    const canCompose = !isClosed && (role === 'rh' ? true : rhStarted);

    const fillDemo = () => { if (canCompose && !comment) setComment(DEMO_REPLY[role] || DEMO_REPLY.colaborador); };
    const attachDemo = () => { if (canCompose) { setAttach('comprovante.pdf'); toast({ kind: 'info', title: 'Arquivo anexado', message: 'comprovante.pdf pronto para envio.' }); } };
    const closeTicket = () => {
        setClosed(true); setComment(''); setAttach(null);
        setThread(t => [...t, { sistema: true, when: nowStampBR(), texto: 'Solicitação encerrada' }]);
        toast({ kind: 'succ', title: 'Solicitação encerrada', message: 'A conversa foi encerrada e não aceita novas mensagens.' });
    };

    const send = () => {
        if (!canCompose || (!comment.trim() && !attach)) return;
        const msg = {
            autor: role === 'rh' ? (rhName || 'Analista de RH') : (colabName || 'Colaborador'),
            papel: role,
            when: nowStampBR(),
            texto: comment.trim(),
            anexos: attach ? [attach] : [],
        };
        const next = [...thread, msg];
        setThread(next); persist(next);
        setComment(''); setAttach(null);
        toast({ kind: 'succ', title: 'Comentário enviado', message: role === 'rh' ? 'O colaborador foi notificado.' : 'O RH foi notificado da sua resposta.' });
        if (role === 'colaborador') {
            setTimeout(() => {
                setThread(t => [...t,
                    { autor: rhName || 'Analista de RH', papel: 'rh', when: nowStampBR(), texto: 'Recebido, obrigada! Está tudo certo com o documento enviado. Sua solicitação foi concluída e o benefício já está atualizado.', anexos: [] },
                    { sistema: true, when: nowStampBR(), texto: 'Solicitação encerrada' },
                ]);
                setClosed(true);
            }, 1600);
        }
    };

    const title = role === 'rh' ? 'Comunicação com o colaborador' : 'Comunicação com o RH';
    const placeholder = role === 'rh' ? 'Escreva uma mensagem para o colaborador...' : 'Deixe um comentário para o RH...';

    return (
        <div className="td-card">
            <div className="td-chat-head">
                <div className="td-section-title" style={{ margin: 0 }}>{title}</div>
                {isClosed && <span className="td-chat-closed-tag"><i className="fa fa-lock" /> Solicitação encerrada</span>}
            </div>
            {thread.length === 0 && !forceClosed ? (
                <div className="td-empty-inner">
                    <div className="td-empty-ic"><i className="fa fa-comment-dots" /></div>
                    <p>{role === 'rh'
                        ? 'Use este espaço para entrar em contato com o colaborador caso precise de algo adicional sobre este chamado.'
                        : 'O RH pode usar este espaço para entrar em contato caso precise de algo adicional sobre este chamado.'}</p>
                </div>
            ) : (
                <div className="td-thread">
                    {(forceClosed ? [...thread, { sistema: true, when: nowStampBR(), texto: forceClosedNote || 'Solicitação encerrada' }] : thread).map((msg, i) => {
                        if (msg.sistema) return (
                            <div className="td-sys" key={i}><span><i className="fa fa-circle-check" /> {msg.texto} · {msg.when}</span></div>
                        );
                        const mine = msg.papel === role;
                        const isRH = msg.papel === 'rh';
                        return (
                            <div className={`td-comment ${mine ? 'me' : 'rh'}`} key={i}>
                                <div className={`td-msg-ava ${mine ? 'me' : ''}`}>{initialsOf(msg.autor)}</div>
                                <div className="td-msg-body">
                                    <div className="td-msg-head">
                                        <span className="td-msg-author">{msg.autor}</span>
                                        <span className="td-msg-role">{isRH ? 'Analista de RH' : 'Colaborador'}</span>
                                        <span className="td-msg-when">{msg.when}</span>
                                    </div>
                                    {msg.texto && <div className="td-msg-text">{msg.texto}</div>}
                                    {msg.anexos && msg.anexos.length > 0 && (
                                        <div className="td-msg-anexos">
                                            <span className="td-msg-anexos-label">Anexos:</span>
                                            {msg.anexos.map((a, j) => (
                                                <span className="td-msg-chip" key={j}><i className="fa fa-paperclip" /> {a}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {isClosed && role === 'rh' && (
                <div className="td-rating">
                    <div className="td-rating-lbl">Avaliação do colaborador</div>
                    <div className="td-rating-stars">{[1, 2, 3, 4, 5].map(n => <i key={n} className={`fa fa-star ${n <= 4 ? 'on' : ''}`} />)}</div>
                    <div className="td-rating-sub">4 de 5</div>
                </div>
            )}

            {isClosed && role === 'colaborador' && (
                <div className="td-rating">
                    <div className="td-rating-lbl">Como você avalia este atendimento?</div>
                    <div className="td-rating-stars">
                        {[1, 2, 3, 4, 5].map(n => (
                            <i key={n} className={`fa fa-star clickable ${n <= rating ? 'on' : ''}`}
                               onClick={() => { setRating(n); toast({ kind: 'succ', title: 'Avaliação enviada', message: `Você avaliou o atendimento com ${n} de 5.` }); }} />
                        ))}
                    </div>
                    <div className="td-rating-sub">{rating ? `${rating} de 5` : 'Clique nas estrelas para avaliar'}</div>
                </div>
            )}

            <div className="td-composer">
                {isClosed && (
                    <div className="td-composer-locked"><i className="fa fa-lock" /> Esta solicitação foi encerrada. Não é possível enviar novas mensagens.</div>
                )}
                {!canCompose && !isClosed && (
                    <div className="td-composer-locked"><i className="fa fa-lock" /> Aguarde o RH iniciar o contato para poder responder.</div>
                )}
                {attach && canCompose && (
                    <div className="td-composer-attach">
                        <i className="fa fa-paperclip" /> <span>{attach}</span>
                        <i className="fa fa-times td-composer-attach-x" onClick={() => setAttach(null)} />
                    </div>
                )}
                <div className="td-composer-row">
                    <input
                        className="td-composer-input"
                        placeholder={isClosed ? 'Solicitação encerrada' : canCompose ? 'Clique para inserir uma resposta de exemplo' : 'Conversa ainda não iniciada pelo RH'}
                        value={comment}
                        readOnly
                        disabled={!canCompose}
                        onClick={fillDemo}
                        onFocus={fillDemo}
                        onKeyDown={e => { if (e.key === 'Enter') send(); }}
                    />
                    <button className="td-composer-clip" title="Anexar arquivo" disabled={!canCompose} onClick={attachDemo}>
                        <i className="fa fa-paperclip" />
                    </button>
                    <Button priority="primary" disabled={!canCompose} onClick={send}>Comentar</Button>
                </div>
            </div>
        </div>
    );
}

/* ─── Ticket detail (Detalhes do chamado) ─── */
function TicketDetail({ ticket, onBack }) {
    const d = ticket.detail || { fields: [], deps: [], docs: [] };
    return (
        <div className="app-main-inner">
            <div className="bx-header bx-divider">
                <div className="td-back" onClick={onBack}><i className="fa fa-arrow-left" /> Meus chamados</div>
                <Breadcrumb onHome={onBack} items={[
                    { label: 'Colaborador', onClick: onBack },
                    { label: 'Acompanhamento de Chamados', onClick: onBack },
                    { label: ticket.id },
                ]} />
            </div>

            <div className="bx-body">
                <div className="td-card">
                    <div className="td-top">
                        <div className={`td-tile ${d.tile || ticket.soft}`}><i className={`fa ${ticket.icon}`} /></div>
                        <div className="td-headings">
                            <h2>{ticket.title}</h2>
                            <div className="td-sub">{ticket.meta}</div>
                        </div>
                        <StatusPill color={ticket.color}>{ticket.status}</StatusPill>
                    </div>

                    <div className="td-section">
                        <div className="td-section-title">Detalhes da solicitação</div>
                        <div className="td-fields">
                            {d.fields.map(([k, v]) => (
                                <div className="td-field" key={k}>
                                    <span className="td-k">{k}</span>
                                    <span className="td-v">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {d.deps && d.deps.length > 0 && (
                        <div className="td-section">
                            <div className="td-section-title">Dependentes incluídos</div>
                            <div className="td-deps">
                                {d.deps.map((dep, i) => (
                                    <div className="td-dep" key={i}>
                                        <div className="td-dep-ava"><i className="fa fa-user" /></div>
                                        <div className="td-dep-body">
                                            <div className="td-dep-name">{dep.nome}</div>
                                            <div className="td-dep-meta">CPF {dep.cpf} · Nasc. {dep.nasc} · {dep.rel}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {d.docs && d.docs.length > 0 && (
                        <div className="td-section">
                            <div className="td-section-title">Documentos enviados</div>
                            <div className="td-docs">
                                {d.docs.map((doc, i) => (
                                    <div className="td-doc" key={i}>
                                        <i className="fa fa-file-lines" />
                                        <span>{doc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <CommunicationPanel
                    storeKey={ticket.id}
                    seed={d.thread || []}
                    role="colaborador"
                    rhName="Mariana Costa"
                    colabName="Carlos Eduardo Lima"
                />
            </div>
        </div>
    );
}

/* ─── Colaborador panel ─── */
function ColaboradorScreen({ onOpenFlyout, initialTab, initialTicketId }) {
    const [tab, setTab] = useStateS(initialTab || 'solicitacao');
    const [detailTicket, setDetailTicket] = useStateS(initialTicketId ? (COLAB_TICKETS.find(t => t.id === initialTicketId) || null) : null);
    const toast = useToast();

    if (detailTicket) {
        return <TicketDetail ticket={detailTicket} onBack={() => setDetailTicket(null)} />;
    }

    return (
        <div className="app-main-inner">
            <div className="bx-header bx-divider">
                <h1>Gestão de Benefícios</h1>
                <Breadcrumb onHome={onOpenFlyout} items={[
                    { label: 'Gestão de Benefícios', onClick: onOpenFlyout },
                    { label: 'Colaborador' },
                ]} />
            </div>

            <Tabs
                items={[
                    { id: 'solicitacao', label: 'Solicitação de Benefícios' },
                    { id: 'chamados',    label: 'Acompanhamento de Chamados' },
                ]}
                active={tab} onChange={setTab}
            />

            <div className="bx-body">
                {tab === 'solicitacao' && (
                    <>
                        <div className="kpi-grid grid-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
                            <Kpi icon="fa-check-circle"      soft="soft-green"  label="Benefícios Ativos"      value="2" />
                            <Kpi icon="fa-file-alt"          soft="soft-blue"   label="Benefícios Disponíveis" value="3" />
                            <Kpi icon="fa-exclamation-circle" soft="soft-orange" label="Pendente Adesão"        value="1" />
                        </div>
                        <div className="bx-cards">
                            {COLAB_BENEFITS.map(b => (
                                <BenefitCard key={b.id} {...b}
                                    onClick={() => window.dispatchEvent(new CustomEvent('sds-open-assistant', {
                                        detail: { benefitId: b.id, entry: b.link === 'Gerenciar' ? 'gerenciar' : 'solicitar' }
                                    }))}
                                />
                            ))}
                        </div>
                    </>
                )}

                {tab === 'chamados' && (
                    <Panel
                        title="Meus chamados"
                        actions={<Button priority="primary" size="small" icon="fa-plus" onClick={() => toast({ kind: 'succ', title: 'Novo chamado', message: 'Formulário de abertura de chamado iniciado.' })}>Abrir chamado</Button>}
                    >
                        {COLAB_TICKETS.some(t => t.unread) && (
                            <div className="chamados-alert" onClick={() => setDetailTicket(COLAB_TICKETS.find(t => t.unread))}>
                                <i className="fa fa-comment-dots" />
                                <span>O RH entrou em contato sobre um dos seus chamados.</span>
                                <i className="fa fa-arrow-right chamados-alert-go" />
                            </div>
                        )}
                        <div>
                            {COLAB_TICKETS.map(t => (
                                <div key={t.id} className="ticket-row">
                                    <div className={`tk-icon ${t.soft}`}>
                                        <i className={`fa ${t.icon}`} />
                                        {t.unread && <span className="tk-dot" />}
                                    </div>
                                    <div className="tk-body">
                                        <div className="tk-title">{t.title}</div>
                                        <div className="tk-meta">{t.meta}</div>
                                    </div>
                                    <StatusPill color={t.color}>{t.status}</StatusPill>
                                    <Button priority="tertiary" size="small" rightIcon="fa-arrow-right" onClick={() => setDetailTicket(t)}>Detalhes</Button>
                                </div>
                            ))}
                        </div>
                    </Panel>
                )}
            </div>
        </div>
    );
}

/* ─── RH: Acompanhamento de Colaboradores (tabela) ─── */
function RHCollaboratorsTracking({ onView, toast }) {
    const [query, setQuery] = useStateS('');
    const [exportOpen, setExportOpen] = useStateS(false);
    const ALL_COLS = ['Código / Título', 'Status', 'Nome do colaborador', 'Tipo de Benefício', 'Tipo de Solicitação', 'Data de abertura', 'Responsável RH'];
    const ALL_STATUS = ['Aguardando resposta do colaborador', 'Em andamento', 'Concluída', 'Recusada'];
    const [exp, setExp] = useStateS({ formato: 'xlsx', escopo: 'filtrados', status: [...ALL_STATUS], colunas: [...ALL_COLS] });
    const toggleArr = (key, val) => setExp(e => ({ ...e, [key]: e[key].includes(val) ? e[key].filter(x => x !== val) : [...e[key], val] }));
    const q = query.trim().toLowerCase();
    const rows = RH_COLLABORATORS.filter(c =>
        !q || [c.codigo, c.titulo, c.nome, c.beneficio, c.tipo, c.rh].join(' ').toLowerCase().includes(q)
    );
    const count = t => RH_COLLABORATORS.filter(c => c.tipo === t).length;
    const fmtData = d => d;
    const solStatusColor = s => s === 'Concluída' ? 'green' : s === 'Recusada' ? 'red' : s === 'Em andamento' ? 'blue' : 'orange';
    const solTipoColor = t => t === 'Alteração' ? 'green' : t === 'Inclusão' ? 'blue' : 'red';
    const cols = ALL_COLS;

    const exportCount = () => {
        let base = exp.escopo === 'todos' ? RH_COLLABORATORS : rows;
        return base.filter(c => exp.status.includes(c.solStatus)).length;
    };
    const FORMATOS = [
        { id: 'xlsx', label: 'Excel (.xlsx)', icon: 'fa-file-excel' },
        { id: 'csv',  label: 'CSV (.csv)',    icon: 'fa-file-csv' },
        { id: 'pdf',  label: 'PDF (.pdf)',    icon: 'fa-file-pdf' },
    ];
    const runExport = () => {
        const n = exportCount();
        setExportOpen(false);
        toast({ kind: 'succ', title: 'Exportação iniciada', message: `${n} solicitaç${n === 1 ? 'ão' : 'ões'} · ${exp.colunas.length} colunas · ${exp.formato.toUpperCase()}. O arquivo será baixado em instantes.` });
    };

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ font: '400 22px/1.3 "Inter", var(--sds-font-family)', color: 'var(--sds-fg-default)', margin: 0 }}>Acompanhamento de Colaboradores</h2>
                <p style={{ fontSize: 14, color: 'var(--sds-fg-muted)', margin: '6px 0 0' }}>Gerencie e acompanhe informações dos colaboradores e sua participação nos benefícios</p>
            </div>

            <div className="rhc-toolbar">
                <div className="rhc-search">
                    <i className="fa fa-search" />
                    <input placeholder="Buscar por código, título, nome..." value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <Button priority="default" icon="fa-filter" onClick={() => toast({ kind: 'info', title: 'Filtros', message: 'Abrindo opções de filtro avançado.' })}>Filtros</Button>
                <Button priority="primary" icon="fa-download" onClick={() => setExportOpen(true)}>Exportar</Button>
            </div>

            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', margin: '20px 0 24px' }}>
                <div className="kpi rhc-kpi"><div><span className="rhc-kpi-num blue">{RH_COLLABORATORS.length}</span><span className="rhc-kpi-lbl">Total de Solicitações</span></div></div>
                <div className="kpi rhc-kpi"><div><span className="rhc-kpi-num red">{count('Exclusão')}</span><span className="rhc-kpi-lbl">Total para Exclusão</span></div></div>
                <div className="kpi rhc-kpi"><div><span className="rhc-kpi-num green">{count('Alteração')}</span><span className="rhc-kpi-lbl">Total para Alteração</span></div></div>
                <div className="kpi rhc-kpi"><div><span className="rhc-kpi-num blue">{count('Inclusão')}</span><span className="rhc-kpi-lbl">Total para Inclusão</span></div></div>
            </div>

            <div className="rhc-tablecard">
                <table className="sds-table rhc-table">
                    <thead>
                        <tr>
                            {cols.map(c => (
                                <th key={c}>{c} <i className="fa fa-sort rhc-sort" /></th>
                            ))}
                            <th className="rhc-view-h">Visualização</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((c, i) => (
                            <tr key={i}>
                                <td className="rhc-code"><span className="rhc-code-n">{c.codigo}</span> <span className="rhc-code-d">—</span> <span className="rhc-code-t">{c.titulo}</span></td>
                                <td><StatusPill color={solStatusColor(c.solStatus)}>{c.solStatus}</StatusPill></td>
                                <td className="rhc-strong">{c.nome}</td>
                                <td>{c.beneficio}</td>
                                <td><span className={`rhc-chip ${solTipoColor(c.tipo)}`}>{c.tipo}</span></td>
                                <td className="rhc-nowrap">{fmtData(c.when)}</td>
                                <td>{c.rh}</td>
                                <td className="rhc-view-c">
                                    <Button priority="primary" size="small" rightIcon="fa-up-right-from-square" onClick={() => onView(c)}>Visualizar</Button>
                                </td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr><td colSpan={cols.length + 1} className="rhc-empty">Nenhum colaborador encontrado. Refine sua busca.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                open={exportOpen}
                onClose={() => setExportOpen(false)}
                title="Exportar solicitações"
                width={560}
                footer={
                    <>
                        <Button priority="tertiary" onClick={() => setExportOpen(false)}>Cancelar</Button>
                        <Button priority="primary" icon="fa-download" disabled={exp.colunas.length === 0 || exp.status.length === 0} onClick={runExport}>Exportar {exportCount()} registro(s)</Button>
                    </>
                }
            >
                <div className="exp-body">
                    <div className="exp-group">
                        <div className="exp-label">Formato do arquivo</div>
                        <div className="exp-formats">
                            {FORMATOS.map(f => (
                                <button key={f.id} className={`exp-fmt ${exp.formato === f.id ? 'sel' : ''}`} onClick={() => setExp(e => ({ ...e, formato: f.id }))}>
                                    <i className={`fa ${f.icon}`} />
                                    <span>{f.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="exp-group">
                        <div className="exp-label">Quais registros exportar</div>
                        <div className="exp-radios">
                            <Radio name="escopo" checked={exp.escopo === 'filtrados'} onChange={() => setExp(e => ({ ...e, escopo: 'filtrados' }))}>Resultados filtrados na tela ({rows.length})</Radio>
                            <Radio name="escopo" checked={exp.escopo === 'todos'} onChange={() => setExp(e => ({ ...e, escopo: 'todos' }))}>Todas as solicitações ({RH_COLLABORATORS.length})</Radio>
                        </div>
                    </div>

                    <div className="exp-group">
                        <div className="exp-label">Status incluídos</div>
                        <div className="exp-chips">
                            {ALL_STATUS.map(s => (
                                <button key={s} className={`exp-chip ${exp.status.includes(s) ? 'sel' : ''}`} onClick={() => toggleArr('status', s)}>
                                    <i className={`fa ${exp.status.includes(s) ? 'fa-check' : 'fa-plus'}`} /> {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="exp-group">
                        <div className="exp-label-row">
                            <span className="exp-label" style={{ margin: 0 }}>Colunas a exportar</span>
                            <button className="exp-selall" onClick={() => setExp(e => ({ ...e, colunas: e.colunas.length === ALL_COLS.length ? [] : [...ALL_COLS] }))}>
                                {exp.colunas.length === ALL_COLS.length ? 'Desmarcar todas' : 'Selecionar todas'}
                            </button>
                        </div>
                        <div className="exp-cols">
                            {ALL_COLS.map(c => (
                                <Checkbox key={c} checked={exp.colunas.includes(c)} onChange={() => toggleArr('colunas', c)}>{c}</Checkbox>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

/* ─── RH: detalhe completo do chamado do colaborador ─── */
function CollaboratorDetail({ colab, onBack }) {
    const d = colab.detail || { fields: [], deps: [], docs: [] };
    const toast = useToast();
    const solTipoColor = colab.tipo === 'Alteração' ? 'green' : colab.tipo === 'Inclusão' ? 'blue' : 'red';
    const [decision, setDecision] = useStateS(null); // 'aprovada' | 'recusada'
    const editable = colab.beneficio === 'Plano de Saúde';
    const toIso = v => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(v)); return m ? `${m[3]}-${m[2]}-${m[1]}` : v; };
    const [planoForm, setPlanoForm] = useStateS(() => Object.fromEntries([...(d.plano || []), ...(d.datas || [])].map(([k, v]) => [k, /^Data /.test(k) ? toIso(v) : v])));
    const setPF = (k, v) => setPlanoForm(f => ({ ...f, [k]: v }));
    const editableFields = ks => (
        <div className="td-editgrid">
            {ks.map(([k]) => (
                <Field key={k} label={k}>
                    {k === 'Desconto no mês'
                        ? <Select value={planoForm[k]} onChange={v => setPF(k, v)} options={[{ value: 'Sim', label: 'Sim' }, { value: 'Não', label: 'Não' }]} />
                        : <Textfield type={/^Data /.test(k) ? 'date' : 'text'} value={planoForm[k] || ''} onChange={v => setPF(k, v)} />}
                </Field>
            ))}
        </div>
    );
    const [decidable] = useStateS((colab.detail || {}).status === 'Pendente' || (colab.detail || {}).status === 'Em análise');
    const decide = kind => {
        setDecision(kind);
        toast({
            kind: kind === 'aprovada' ? 'succ' : 'err',
            title: kind === 'aprovada' ? 'Solicitação aprovada' : 'Solicitação recusada',
            message: `${colab.tipo} — ${colab.nome}`,
            duration: 6000,
        });
        colab.solStatus = kind === 'aprovada' ? 'Concluída' : 'Recusada';
        if (colab.detail) { colab.detail.status = kind === 'aprovada' ? 'Aprovado' : 'Recusado'; colab.detail.color = kind === 'aprovada' ? 'green' : 'red'; }
    };
    const [agrupador, setAgrupador] = useStateS((d.escala && d.escala.agrupador) || '');
    const [escalaVT, setEscalaVT] = useStateS((d.escala && d.escala.escala) || '');

    return (
        <div className="app-main-inner">
            <div className="bx-header bx-divider">
                <div className="td-back" onClick={onBack}><i className="fa fa-arrow-left" /> Acompanhamento de Colaboradores</div>
                <Breadcrumb onHome={onBack} items={[
                    { label: 'Analista de RH', onClick: onBack },
                    { label: 'Acompanhamento', onClick: onBack },
                    { label: d.protocolo || colab.matricula },
                ]} />
            </div>

            <div className="bx-body">
                <div className="td-card">
                    <div className="td-top">
                        <div className={`td-tile ${d.tile || colab.bTile}`}><i className={`fa ${colab.bIcon}`} /></div>
                        <div className="td-headings">
                            <h2>{colab.tipo} — {colab.beneficio}</h2>
                            <div className="td-sub">Protocolo {d.protocolo} · Aberto em {d.aberto}</div>
                        </div>
                        <StatusPill color={d.color}>{d.status}</StatusPill>
                    </div>

                    <div className="td-section">
                        <div className="td-section-title">Dados do colaborador</div>
                        <div className="td-fields">
                            {[['Nome', colab.nome], ['Matrícula', colab.matricula], ['CPF', colab.cpf], ['Cargo', colab.cargo], ['Empresa', colab.empresa], ['Filial', colab.filial], ['Responsável RH', colab.rh]].map(([k, v]) => (
                                <div className="td-field" key={k}><span className="td-k">{k}</span><span className="td-v">{v}</span></div>
                            ))}
                        </div>
                    </div>

                    {d.depsTable && d.depsTable.length > 0 && (
                        <div className="td-section">
                            <div className="td-section-title">Dependentes</div>
                            <div className="td-tablewrap">
                                <table className="td-table">
                                    <thead><tr><th>Nome</th><th>CPF</th><th>Data de nascimento</th><th>Grau de parentesco</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {d.depsTable.map((dep, i) => (
                                            <tr key={i}>
                                                <td className="rhc-strong">{dep.nome}</td>
                                                <td className={dep.ok ? '' : 'td-cpf-bad'}>{dep.cpf}</td>
                                                <td>{dep.nasc}</td>
                                                <td>{dep.rel}</td>
                                                <td><span className={`rhc-chip ${dep.ok ? 'green' : 'orange'}`}><i className={`fa ${dep.ok ? 'fa-check' : 'fa-circle-exclamation'}`} /> {dep.ok ? 'Válido' : 'CPF inválido'}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {d.docs && d.docs.length > 0 && (
                        <div className="td-section">
                            <div className="td-section-title">Documentos enviados</div>
                            <div className="td-docs">
                                {d.docs.map((doc, i) => (
                                    <div className="td-doc" key={i}><i className="fa fa-file-lines" /><span>{doc}</span></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!editable && (
                    <div className="td-section">
                        <div className="td-section-title">Detalhes da solicitação</div>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                            <span className="rhc-chip blue">{colab.beneficio}</span>
                            <span className={`rhc-chip ${solTipoColor}`}>{colab.tipo}</span>
                        </div>
                        <div className="td-fields">
                            {d.fields.map(([k, v]) => (
                                <div className="td-field" key={k}><span className="td-k">{k}</span><span className="td-v">{v}</span></div>
                            ))}
                        </div>
                    </div>
                    )}

                    {d.plano && (
                        <div className="td-section">
                            <div className="td-section-title">{editable ? 'Detalhes da solicitação' : 'Plano de saúde'}</div>
                            {editable ? editableFields([...d.plano, ...(d.datas || [])]) : (
                                <div className="td-fields">
                                    {d.plano.map(([k, v]) => (
                                        <div className="td-field" key={k}><span className="td-k">{k}</span><span className="td-v">{v}</span></div>
                                    ))}
                                </div>
                            )}
                            <div className="td-note info"><i className="fa fa-info-circle" /><span>Dependentes herdam exatamente o plano do titular. Não é possível definir planos diferentes para dependentes.</span></div>
                        </div>
                    )}

                    {d.datas && !editable && (
                        <div className="td-section">
                            <div className="td-section-title">{colab.tipo === 'Exclusão' ? 'Dados da exclusão' : colab.tipo === 'Inclusão' ? 'Dados da inclusão' : 'Datas e regras'}</div>
                            {editable ? editableFields(d.datas) : (
                                <div className="td-fields">
                                    {d.datas.map(([k, v]) => (
                                        <div className="td-field" key={k}><span className="td-k">{k}</span><span className="td-v">{v}</span></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {d.deps && d.deps.length > 0 && (
                        <div className="td-section">
                            <div className="td-section-title">Dependentes incluídos</div>
                            <div className="td-deps">
                                {d.deps.map((dep, i) => (
                                    <div className="td-dep" key={i}>
                                        <div className="td-dep-ava"><i className="fa fa-user" /></div>
                                        <div className="td-dep-body">
                                            <div className="td-dep-name">{dep.nome}</div>
                                            <div className="td-dep-meta">CPF {dep.cpf} · Nasc. {dep.nasc} · {dep.rel}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {d.escala && (
                        <div className="td-section">
                            <div className="td-section-title">Configurações de escala</div>
                            <div className="td-escala">
                                <Field label="Agrupador de Escala" required>
                                    <Select value={agrupador} onChange={setAgrupador} options={d.escala.agrupadorOpts.map(o => ({ value: o, label: o }))} />
                                </Field>
                                <Field label="Escala de Vale-Transporte" required>
                                    <Select value={escalaVT} onChange={setEscalaVT} options={d.escala.escalaOpts.map(o => ({ value: o, label: o }))} />
                                </Field>
                            </div>
                        </div>
                    )}

                </div>

                <CommunicationPanel
                    storeKey={'rh-' + (d.protocolo || colab.matricula)}
                    seed={d.thread || []}
                    role="rh"
                    rhName={colab.rh}
                    colabName={colab.nome}
                    forceClosed={!!decision}
                    forceClosedNote={decision === 'aprovada' ? 'Solicitação aprovada e encerrada' : 'Solicitação recusada e encerrada'}
                />

                {decidable && (
                    <div className="td-card td-page-actions"><div className="rhc-actions">
                        <Button priority="default" className="btn-danger-outline" icon="fa-xmark" disabled={!!decision} onClick={() => decide('recusada')}>Recusar</Button>
                        <Button priority="primary" icon="fa-check" disabled={!!decision} onClick={() => decide('aprovada')}>Aprovar solicitação</Button>
                    </div></div>
                )}
            </div>
        </div>
    );
}

/* ─── RH: editor da Política de Plano de Saúde ─── */
function PolicySection({ icon, tile, title, children }) {
    return (
        <div className="pol-section">
            <div className="pol-section-head">
                <span className={`pol-sec-ic ${tile}`}><i className={`fa ${icon}`} /></span>
                <h3>{title}</h3>
            </div>
            {children}
        </div>
    );
}

function HealthPolicyEditor({ policy, onBack }) {
    const toast = useToast();
    const [form, setForm] = useStateS({
        nome: '', versao: '', dataCriacao: '', dataVigencia: '',
        empresa: '', filiais: '', status: 'Ativa', tempoMin: '',
        operadoras: [], coparticipacao: '', parentesco: [], contratos: [],
        descricao: '',
    });
    const [docs, setDocs] = useStateS([
        'FAQ Subsídio Unimed Blumenau', 'FAQ Unimed Blumenau', 'Como consultar Extrato de coparticipação',
        'Carteirinha Virtual', 'PA DIGITAL', 'Orientação de Utilização do Plano', 'Manual App',
        'Declaração de União Estável', 'Declaração de Saúde',
    ]);
    const [confirm, setConfirm] = useStateS(null); // 'salvar' | 'excluir' | 'publicar'
    const [addDocOpen, setAddDocOpen] = useStateS(false);
    const [newDoc, setNewDoc] = useStateS('');
    const [polTab, setPolTab] = useStateS('dados'); // 'dados' | 'historico'
    const [history, setHistory] = useStateS([
        { v: 'v3', label: 'Versão atual', autor: 'Maria Santos', when: '28/05/2026 14:20', resumo: 'Coparticipação alterada de 25% para 20%; incluída operadora Bradesco Saúde.', atual: true },
        { v: 'v2', label: 'Revisão de carência', autor: 'João Oliveira', when: '12/03/2026 09:48', resumo: 'Tempo mínimo para adesão ajustado para 30 dias; adicionado contrato PJ.' },
        { v: 'v1', label: 'Versão inicial', autor: 'Maria Santos', when: '05/01/2026 16:05', resumo: 'Criação da política de Plano de Saúde com operadora Unimed.' },
    ]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const toggle = (k, v) => setForm(f => { const arr = f[k]; return { ...f, [k]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] }; });

    const OPERADORAS = ['Unimed', 'Amil', 'Bradesco Saúde'];
    const PARENTESCO = ['Cônjuge', 'Filho(a)', 'Enteado(a)', 'Pai', 'Mãe', 'Namorado(a)'];
    const CONTRATOS = ['CLT', 'Estagiário', 'PJ', 'Terceiros', 'Agregados'];
    const TEMPO_OPTS = [
        { value: 'imediato', label: 'Imediato' }, { value: '30', label: '30 dias' },
        { value: '60', label: '60 dias' }, { value: '90', label: '90 dias' },
    ];
    const EMPRESAS = [
        { value: 'matriz', label: 'Matriz Corporativa' }, { value: 'sul', label: 'Filial Sul' },
        { value: 'sudeste', label: 'Filial Sudeste' }, { value: 'nordeste', label: 'Filial Nordeste' },
    ];
    const FILIAIS = [
        { value: 'todas', label: 'Todas as filiais' }, { value: 'sp', label: 'São Paulo - SP' },
        { value: 'rj', label: 'Rio de Janeiro - RJ' }, { value: 'bh', label: 'Belo Horizonte - MG' },
    ];

    const confirmActions = {
        salvar:   { title: 'Salvar alterações?', body: 'As alterações feitas nesta política serão salvas como rascunho.', btn: 'Salvar alterações', priority: 'primary', toast: { kind: 'succ', title: 'Política salva', message: 'As alterações foram salvas com sucesso.' }, back: false },
        excluir:  { title: 'Excluir política?', body: 'Esta ação não poderá ser desfeita. A política de Plano de Saúde e suas configurações serão removidas.', btn: 'Excluir política', priority: 'default', danger: true, toast: { kind: 'warn', title: 'Política excluída', message: 'A política de Plano de Saúde foi removida.' }, back: true },
        restaurar:{ title: 'Restaurar esta versão?', body: 'A política voltará ao estado desta versão. A versão atual será mantida no histórico.', btn: 'Restaurar versão', priority: 'primary', toast: { kind: 'succ', title: 'Versão restaurada', message: 'A política foi restaurada para a versão selecionada.' }, back: false },
    };

    const runConfirm = () => {
        const a = confirmActions[typeof confirm === 'string' ? confirm : confirm.type];
        if (a) { toast(a.toast); setConfirm(null); if (a.back) onBack(); }
    };

    return (
        <div className="app-main-inner">
            <div className="bx-header bx-divider">
                <div className="td-back" onClick={onBack}><i className="fa fa-arrow-left" /> Visão Geral</div>
                <h1 style={{ marginTop: 12 }}>Política de Plano de Saúde</h1>
                <p style={{ fontSize: 15, color: 'var(--sds-fg-muted)', margin: '8px 0 0', paddingBottom: 20 }}>Gerencie as condições e regras de adesão ao benefício de plano de saúde.</p>
            </div>

            <div className="bx-body pol-tabsbar">
                <Tabs
                    items={[
                        { id: 'dados',     label: <span><i className="fa fa-file-lines" style={{ marginRight: 8 }} />Dados da Política</span> },
                        { id: 'historico', label: <span><i className="fa fa-clock-rotate-left" style={{ marginRight: 8 }} />Histórico de Alterações</span> },
                    ]}
                    active={polTab} onChange={setPolTab}
                />
            </div>

            {polTab === 'dados' && (
            <div className="bx-body" style={{ paddingTop: 0 }}>
                <div className="pol-card">
                    {/* Identificação */}
                    <PolicySection icon="fa-hospital" tile="soft-red" title="Identificação da Política">
                        <div className="grid grid-2 gap-16">
                            <Field label="Nome da política"><Textfield value={form.nome} onChange={v => set('nome', v)} placeholder="Ex: Política de Plano de Saúde 2024" /></Field>
                            <Field label="Versão"><Textfield value={form.versao} onChange={v => set('versao', v)} placeholder="Ex: 1.0" /></Field>
                            <Field label="Data de criação"><Textfield type="date" value={form.dataCriacao} onChange={v => set('dataCriacao', v)} placeholder="dd/mm/aaaa" /></Field>
                            <Field label="Data de vigência"><Textfield type="date" value={form.dataVigencia} onChange={v => set('dataVigencia', v)} placeholder="dd/mm/aaaa" /></Field>
                            <Field label="Empresa"><Select value={form.empresa} onChange={v => set('empresa', v)} options={EMPRESAS} placeholder="Selecione uma opção" /></Field>
                            <Field label="Filiais"><Select value={form.filiais} onChange={v => set('filiais', v)} options={FILIAIS} placeholder="Selecione uma opção" /></Field>
                            <Field label="Status"><Select value={form.status} onChange={v => set('status', v)} options={[{ value: 'Ativa', label: 'Ativa' }, { value: 'Inativa', label: 'Inativa' }, { value: 'Em revisão', label: 'Em revisão' }]} /></Field>
                            <Field label="Tempo mínimo para adesão"><Select value={form.tempoMin} onChange={v => set('tempoMin', v)} options={TEMPO_OPTS} placeholder="Selecione uma opção" /></Field>
                        </div>
                    </PolicySection>

                    {/* Operadora */}
                    <PolicySection icon="fa-building" tile="soft-blue" title="Dados da Operadora">
                        <div className="grid grid-2 gap-16" style={{ alignItems: 'start' }}>
                            <div>
                                <div className="pol-grouplabel">Nome da operadora</div>
                                <div className="pol-checks">
                                    {OPERADORAS.map(o => <Checkbox key={o} checked={form.operadoras.includes(o)} onChange={() => toggle('operadoras', o)}>{o}</Checkbox>)}
                                </div>
                            </div>
                            <Field label="Percentual de coparticipação (%)"><Textfield type="number" value={form.coparticipacao} onChange={v => set('coparticipacao', v)} placeholder="20" suffix={<i className="fa fa-percent" />} /></Field>
                        </div>
                    </PolicySection>

                    {/* Parentesco */}
                    <PolicySection icon="fa-people-roof" tile="soft-orange" title="Grau de Parentesco">
                        <div className="pol-grouplabel">Selecione o tipo de Dependentes Permitidos</div>
                        <div className="pol-checks cols-2">
                            {PARENTESCO.map(p => <Checkbox key={p} checked={form.parentesco.includes(p)} onChange={() => toggle('parentesco', p)}>{p}</Checkbox>)}
                        </div>
                    </PolicySection>

                    {/* Contratos */}
                    <PolicySection icon="fa-file-lines" tile="soft-gray" title="Tipos de Contratos">
                        <div className="pol-grouplabel">Selecione os tipos de contrato elegíveis</div>
                        <div className="pol-checks cols-2">
                            {CONTRATOS.map(c => <Checkbox key={c} checked={form.contratos.includes(c)} onChange={() => toggle('contratos', c)}>{c}</Checkbox>)}
                        </div>
                    </PolicySection>

                    {/* Observações */}
                    <PolicySection icon="fa-clipboard" tile="soft-orange" title="Observações Gerais da Política">
                        <Field label="Descrição da política">
                            <Textarea value={form.descricao} onChange={v => set('descricao', v)} rows={8}
                                placeholder={'A empresa oferece plano de saúde como benefício aos colaboradores, com opções de adesão individual ou familiar. A participação do colaborador será de acordo com o percentual estabelecido sobre o valor do plano escolhido.\n\n[Detalhe aqui as condições de elegibilidade, prazos de carência, procedimentos para inclusão/exclusão de dependentes, etc.]'} />
                        </Field>
                    </PolicySection>

                    {/* Documentação */}
                    <PolicySection icon="fa-paperclip" tile="soft-blue" title="Documentação para o Colaborador">
                        <div className="pol-grouplabel">Documentos disponíveis para os colaboradores</div>
                        <div style={{ fontSize: 14, color: 'var(--sds-fg-subtle)', marginBottom: 8 }}>Acesse:</div>
                        <div className="pol-docs">
                            {docs.map((doc, i) => (
                                <div className="pol-doc" key={i}>
                                    <a className="pol-doc-link">{doc}</a>
                                    <i className="fa fa-times pol-doc-x" title="Remover" onClick={() => setDocs(docs.filter((_, j) => j !== i))} />
                                </div>
                            ))}
                        </div>
                        <button className="pol-adddoc" onClick={() => { setNewDoc(''); setAddDocOpen(true); }}><i className="fa fa-plus" /> Adicionar documento</button>
                    </PolicySection>
                </div>

                {/* Ações */}
                <div className="pol-actions">
                    <Button priority="tertiary" onClick={onBack}>Cancelar</Button>
                    <div className="pol-actions-right">
                        <Button priority="default" className="btn-outline-blue" onClick={() => setConfirm('excluir')}>Excluir política</Button>
                        <Button priority="default" onClick={() => setConfirm('salvar')} icon="fa-floppy-disk">Salvar alterações</Button>
                        <Button priority="primary" icon="fa-upload" onClick={() => toast({ kind: 'succ', title: 'Política publicada', message: 'A política de Plano de Saúde foi publicada para os colaboradores.' })}>Publicar política</Button>
                    </div>
                </div>
            </div>
            )}

            {polTab === 'historico' && (
            <div className="bx-body" style={{ paddingTop: 0 }}>
                <div className="pol-card">
                    <PolicySection icon="fa-clock-rotate-left" tile="soft-orange" title="Histórico de Alterações">
                        {history.length === 0 ? (
                            <div className="pol-hist-empty">
                                <div className="pol-hist-empty-ic"><i className="fa fa-clock-rotate-left" /></div>
                                <p className="pol-hist-empty-t">Nenhuma alteração registrada ainda.</p>
                                <p className="pol-hist-empty-s">As alterações feitas nesta política aparecerão aqui.</p>
                            </div>
                        ) : (
                            <div className="pol-timeline">
                                {history.map((h, i) => (
                                    <div className={`pol-hist ${h.atual ? 'atual' : ''}`} key={h.v}>
                                        <div className="pol-hist-dot"><i className={`fa ${h.atual ? 'fa-circle-check' : 'fa-clock-rotate-left'}`} /></div>
                                        <div className="pol-hist-body">
                                            <div className="pol-hist-top">
                                                <span className="pol-hist-title">{h.label}</span>
                                                {h.atual
                                                    ? <span className="rhc-chip blue">Versão atual</span>
                                                    : <Button priority="default" size="small" className="btn-outline-blue" icon="fa-clock-rotate-left" onClick={() => setConfirm({ type: 'restaurar', v: h.v })}>Restaurar</Button>}
                                            </div>
                                            <div className="pol-hist-meta"><i className="fa fa-user" /> {h.autor} · {h.when}</div>
                                            <div className="pol-hist-resumo">{h.resumo}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </PolicySection>
                </div>
            </div>
            )}

            {/* Modal de confirmação */}
            <Modal
                open={!!confirm}
                onClose={() => setConfirm(null)}
                title={confirm ? confirmActions[typeof confirm === 'string' ? confirm : confirm.type].title : ''}
                footer={confirm && (() => { const a = confirmActions[typeof confirm === 'string' ? confirm : confirm.type]; return (
                    <>
                        <Button priority="tertiary" onClick={() => setConfirm(null)}>Cancelar</Button>
                        <Button priority="primary" className={a.danger ? 'btn-danger btn-primary' : ''} onClick={runConfirm}>{a.btn}</Button>
                    </>
                ); })()}
            >
                {confirm && <p style={{ margin: 0, fontSize: 14.5, color: 'var(--sds-fg-muted)', lineHeight: 1.55 }}>{confirmActions[typeof confirm === 'string' ? confirm : confirm.type].body}</p>}
            </Modal>

            {/* Modal adicionar documento */}
            <Modal
                open={addDocOpen}
                onClose={() => setAddDocOpen(false)}
                title="Adicionar documento"
                footer={
                    <>
                        <Button priority="tertiary" onClick={() => setAddDocOpen(false)}>Cancelar</Button>
                        <Button priority="primary" disabled={!newDoc.trim()} onClick={() => { setDocs([...docs, newDoc.trim()]); setAddDocOpen(false); toast({ kind: 'succ', title: 'Documento adicionado', message: newDoc.trim() }); }}>Adicionar</Button>
                    </>
                }
            >
                <Field label="Nome do documento"><Textfield value={newDoc} onChange={setNewDoc} placeholder="Ex: Manual de Reembolso" /></Field>
            </Modal>
        </div>
    );
}

/* ─── RH: editor da Política de Vale-Transporte ─── */
function TransportPolicyEditor({ policy, onBack }) {
    const toast = useToast();
    const [form, setForm] = useStateS({
        nome: '', empresa: '', filial: '', versao: '', dataCriacao: '', dataVigencia: '', status: 'Ativa',
        aprovacoes: true, tipoAprovacao: 'lider',
        descricao: '',
        prazoInclusao: '', prazoCancelamento: '', excecaoDezembro: '', recargaAuto: false, outrasRegras: '',
        observacoes: '',
    });
    const [docs, setDocs] = useStateS([
        'FAQ Vale-Transporte', 'Como solicitar recarga do cartão', 'Linhas e tarifas conveniadas',
        'Política de desconto em folha (até 6%)', 'Manual do App de Transporte',
    ]);
    const [addDocOpen, setAddDocOpen] = useStateS(false);
    const [newDoc, setNewDoc] = useStateS('');
    const [confirm, setConfirm] = useStateS(null);
    const [polTab, setPolTab] = useStateS('dados');
    const [extracted, setExtracted] = useStateS(false);
    const [history] = useStateS([
        { v: 'v2', label: 'Versão atual', autor: 'Pedro Costa', when: '24/05/2026 11:10', resumo: 'Prazo de inclusão ajustado para dia 15; aprovação por Líder Imediato ativada.', atual: true },
        { v: 'v1', label: 'Versão inicial', autor: 'Maria Santos', when: '08/01/2026 10:30', resumo: 'Criação da política de Vale-Transporte com recarga manual.' },
    ]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const EMPRESAS = [
        { value: 'matriz', label: 'Matriz Corporativa' }, { value: 'sul', label: 'Filial Sul' },
        { value: 'sudeste', label: 'Filial Sudeste' }, { value: 'nordeste', label: 'Filial Nordeste' },
    ];
    const FILIAIS = [
        { value: 'todas', label: 'Todas as filiais' }, { value: 'sp', label: 'São Paulo - SP' },
        { value: 'rj', label: 'Rio de Janeiro - RJ' }, { value: 'bh', label: 'Belo Horizonte - MG' },
    ];
    const APROVACAO_OPTS = [
        { value: 'lider', label: 'Líder Imediato' }, { value: 'gestor', label: 'Gestor de RH' },
        { value: 'diretoria', label: 'Diretoria' },
    ];

    const confirmActions = {
        salvar:   { title: 'Salvar alterações?', body: 'As alterações feitas nesta política serão salvas como rascunho.', btn: 'Salvar alterações', toast: { kind: 'succ', title: 'Política salva', message: 'As alterações foram salvas com sucesso.' }, back: false },
        excluir:  { title: 'Excluir política?', body: 'Esta ação não poderá ser desfeita. A política de Vale-Transporte e suas configurações serão removidas.', btn: 'Excluir política', danger: true, toast: { kind: 'warn', title: 'Política excluída', message: 'A política de Vale-Transporte foi removida.' }, back: true },
        restaurar:{ title: 'Restaurar esta versão?', body: 'A política voltará ao estado desta versão. A versão atual será mantida no histórico.', btn: 'Restaurar versão', toast: { kind: 'succ', title: 'Versão restaurada', message: 'A política foi restaurada para a versão selecionada.' }, back: false },
    };
    const runConfirm = () => { const a = confirmActions[typeof confirm === 'string' ? confirm : confirm.type]; if (a) { toast(a.toast); setConfirm(null); if (a.back) onBack(); } };

    const extrairRegras = () => {
        setForm(f => ({ ...f, prazoInclusao: f.prazoInclusao || '15', prazoCancelamento: f.prazoCancelamento || '20', excecaoDezembro: f.excecaoDezembro || '10' }));
        setExtracted(true);
        toast({ kind: 'succ', title: 'Regras extraídas', message: 'As regras foram identificadas a partir da política. Revise os campos.' });
    };

    return (
        <div className="app-main-inner">
            <div className="bx-header bx-divider">
                <div className="td-back" onClick={onBack}><i className="fa fa-arrow-left" /> Visão Geral</div>
                <h1 style={{ marginTop: 12 }}>Política de Vale-Transporte</h1>
                <p style={{ fontSize: 15, color: 'var(--sds-fg-muted)', margin: '8px 0 0', paddingBottom: 20 }}>Gerencie e publique as regras internas referentes ao benefício de Vale-Transporte da empresa.</p>
            </div>

            <div className="bx-body pol-tabsbar">
                <Tabs
                    items={[
                        { id: 'dados',     label: <span><i className="fa fa-file-lines" style={{ marginRight: 8 }} />Dados da Política</span> },
                        { id: 'historico', label: <span><i className="fa fa-clock-rotate-left" style={{ marginRight: 8 }} />Histórico de Alterações</span> },
                    ]}
                    active={polTab} onChange={setPolTab}
                />
            </div>

            {polTab === 'dados' && (
            <div className="bx-body" style={{ paddingTop: 0 }}>
                <div className="pol-card">
                    {/* Seção 1 — Identificação */}
                    <PolicySection icon="fa-bus" tile="soft-blue" title="Seção 1 — Identificação da Política">
                        <div className="grid grid-2 gap-16">
                            <Field label="Nome da política"><Textfield value={form.nome} onChange={v => set('nome', v)} placeholder="Ex: Política de Vale-Transporte 2024" /></Field>
                            <Field label="Empresa"><Select value={form.empresa} onChange={v => set('empresa', v)} options={EMPRESAS} placeholder="Selecione uma opção" /></Field>
                            <Field label="Filial"><Select value={form.filial} onChange={v => set('filial', v)} options={FILIAIS} placeholder="Selecione uma opção" /></Field>
                            <Field label="Versão"><Textfield value={form.versao} onChange={v => set('versao', v)} placeholder="Ex: 1.0" /></Field>
                            <Field label="Data de criação"><Textfield type="date" value={form.dataCriacao} onChange={v => set('dataCriacao', v)} placeholder="dd/mm/aaaa" /></Field>
                            <Field label="Data de vigência"><Textfield type="date" value={form.dataVigencia} onChange={v => set('dataVigencia', v)} placeholder="dd/mm/aaaa" /></Field>
                            <Field label="Status"><Select value={form.status} onChange={v => set('status', v)} options={[{ value: 'Ativa', label: 'Ativa' }, { value: 'Inativa', label: 'Inativa' }, { value: 'Em revisão', label: 'Em revisão' }]} /></Field>
                        </div>
                        <div className="grid grid-2 gap-16" style={{ alignItems: 'start', marginTop: 16 }}>
                            <div>
                                <div className="pol-grouplabel">Aprovações</div>
                                <Switch on={form.aprovacoes} onChange={v => set('aprovacoes', v)}>{form.aprovacoes ? 'Ativado' : 'Desativado'}</Switch>
                            </div>
                            {form.aprovacoes && (
                                <Field label="Tipo de aprovação"><Select value={form.tipoAprovacao} onChange={v => set('tipoAprovacao', v)} options={APROVACAO_OPTS} placeholder="Selecione uma opção" /></Field>
                            )}
                        </div>
                    </PolicySection>

                    {/* Política e Regras */}
                    <PolicySection icon="fa-file-lines" tile="soft-blue" title="Política e Regras">
                        <Field label="Descrição da política">
                            <Textarea value={form.descricao} onChange={v => set('descricao', v)} rows={8}
                                placeholder={'A empresa oferece este benefício aos colaboradores elegíveis, conforme as condições definidas nesta política. A participação do colaborador seguirá o percentual estabelecido sobre o valor do benefício.\n\n[Detalhe aqui as condições de elegibilidade, prazos de carência, procedimentos para inclusão/exclusão e demais regras.]'} />
                        </Field>
                    </PolicySection>

                    {/* Seção 3 — Regras Extraídas */}
                    <PolicySection icon="fa-circle-check" tile="soft-green" title="Seção 3 — Regras Extraídas">
                        <p style={{ fontSize: 14, color: 'var(--sds-fg-muted)', margin: '-8px 0 18px' }}>Revise e ajuste as regras extraídas automaticamente da política.</p>
                        <div className="grid grid-2 gap-16" style={{ alignItems: 'start' }}>
                            <Field label="Prazo para inclusão/alteração (dia do mês)"><Textfield type="number" value={form.prazoInclusao} onChange={v => set('prazoInclusao', v)} placeholder="Ex: 15" /></Field>
                            <Field label="Prazo para cancelamento (dia do mês)"><Textfield type="number" value={form.prazoCancelamento} onChange={v => set('prazoCancelamento', v)} placeholder="Ex: 20" /></Field>
                            <Field label="Exceção para dezembro (dia do mês)"><Textfield type="number" value={form.excecaoDezembro} onChange={v => set('excecaoDezembro', v)} placeholder="Ex: 10" /></Field>
                            <div>
                                <div className="pol-grouplabel">Recarga automática</div>
                                <Switch on={form.recargaAuto} onChange={v => set('recargaAuto', v)}>{form.recargaAuto ? 'Ativado' : 'Desativado'}</Switch>
                            </div>
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <Field label="Outras regras importantes">
                                <Textarea value={form.outrasRegras} onChange={v => set('outrasRegras', v)} rows={5} placeholder="Regras adicionais..." />
                            </Field>
                        </div>
                    </PolicySection>

                    {/* Observações */}
                    <PolicySection icon="fa-clipboard" tile="soft-orange" title="Observações Gerais da Política">
                        <p style={{ fontSize: 14, color: 'var(--sds-fg-muted)', margin: '-8px 0 18px' }}>Orientações exibidas ao colaborador no início do fluxo de solicitação do benefício.</p>
                        <Field label="Descrição da política">
                            <Textarea value={form.observacoes} onChange={v => set('observacoes', v)} rows={7} maxLength={500}
                                placeholder={'Ex: O Vale-Transporte acarretará desconto de até 6% do salário-base em folha. A recarga é feita automaticamente todo dia 1º. Solicitações de inclusão ou alteração devem ser feitas até o dia 15 de cada mês.\n\n[Detalhe aqui condições específicas, particularidades da empresa, etc.]'} />
                        </Field>
                        <div className={`pol-counter ${(form.observacoes || '').length >= 500 ? 'full' : ''}`}>{(form.observacoes || '').length}/500 caracteres</div>
                    </PolicySection>

                    {/* Documentação */}
                    <PolicySection icon="fa-paperclip" tile="soft-blue" title="Documentação para o Colaborador">
                        <div className="pol-grouplabel">Documentos disponíveis para os colaboradores</div>
                        <div style={{ fontSize: 14, color: 'var(--sds-fg-subtle)', marginBottom: 8 }}>Anexe FAQs, manuais ou orientações em PDF (até 10 anexos). Acesse:</div>
                        <div className="pol-docs">
                            {docs.map((doc, i) => (
                                <div className="pol-doc" key={i}>
                                    <a className="pol-doc-link">{doc}</a>
                                    <i className="fa fa-times pol-doc-x" title="Remover" onClick={() => setDocs(docs.filter((_, j) => j !== i))} />
                                </div>
                            ))}
                        </div>
                        <button className="pol-adddoc" disabled={docs.length >= 10} onClick={() => { setNewDoc(''); setAddDocOpen(true); }}><i className="fa fa-plus" /> Adicionar documento</button>
                        {docs.length >= 10 && <span className="pol-counter full" style={{ marginLeft: 12 }}>Limite de 10 anexos atingido</span>}
                    </PolicySection>
                </div>

                {/* Ações */}
                <div className="pol-actions">
                    <Button priority="tertiary" onClick={onBack}>Cancelar</Button>
                    <div className="pol-actions-right">
                        <Button priority="default" className="btn-outline-blue" onClick={() => setConfirm('excluir')}>Excluir política</Button>
                        <Button priority="default" onClick={() => setConfirm('salvar')} icon="fa-floppy-disk">Salvar alterações</Button>
                        <Button priority="primary" icon="fa-upload" onClick={() => toast({ kind: 'succ', title: 'Política publicada', message: 'A política de Vale-Transporte foi publicada para os colaboradores.' })}>Publicar política</Button>
                    </div>
                </div>
            </div>
            )}

            {polTab === 'historico' && (
            <div className="bx-body" style={{ paddingTop: 0 }}>
                <div className="pol-card">
                    <PolicySection icon="fa-clock-rotate-left" tile="soft-orange" title="Histórico de Alterações">
                        <div className="pol-timeline">
                            {history.map(h => (
                                <div className={`pol-hist ${h.atual ? 'atual' : ''}`} key={h.v}>
                                    <div className="pol-hist-dot"><i className={`fa ${h.atual ? 'fa-circle-check' : 'fa-clock-rotate-left'}`} /></div>
                                    <div className="pol-hist-body">
                                        <div className="pol-hist-top">
                                            <span className="pol-hist-title">{h.label}</span>
                                            {h.atual
                                                ? <span className="rhc-chip blue">Versão atual</span>
                                                : <Button priority="default" size="small" className="btn-outline-blue" icon="fa-clock-rotate-left" onClick={() => setConfirm({ type: 'restaurar', v: h.v })}>Restaurar</Button>}
                                        </div>
                                        <div className="pol-hist-meta"><i className="fa fa-user" /> {h.autor} · {h.when}</div>
                                        <div className="pol-hist-resumo">{h.resumo}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </PolicySection>
                </div>
            </div>
            )}

            <Modal
                open={!!confirm}
                onClose={() => setConfirm(null)}
                title={confirm ? confirmActions[typeof confirm === 'string' ? confirm : confirm.type].title : ''}
                footer={confirm && (() => { const a = confirmActions[typeof confirm === 'string' ? confirm : confirm.type]; return (
                    <>
                        <Button priority="tertiary" onClick={() => setConfirm(null)}>Cancelar</Button>
                        <Button priority="primary" className={a.danger ? 'btn-danger btn-primary' : ''} onClick={runConfirm}>{a.btn}</Button>
                    </>
                ); })()}
            >
                {confirm && <p style={{ margin: 0, fontSize: 14.5, color: 'var(--sds-fg-muted)', lineHeight: 1.55 }}>{confirmActions[typeof confirm === 'string' ? confirm : confirm.type].body}</p>}
            </Modal>

            <Modal
                open={addDocOpen}
                onClose={() => setAddDocOpen(false)}
                title="Adicionar documento"
                footer={
                    <>
                        <Button priority="tertiary" onClick={() => setAddDocOpen(false)}>Cancelar</Button>
                        <Button priority="primary" disabled={!newDoc.trim()} onClick={() => { setDocs([...docs, newDoc.trim()]); setAddDocOpen(false); toast({ kind: 'succ', title: 'Documento adicionado', message: newDoc.trim() }); }}>Adicionar</Button>
                    </>
                }
            >
                <Field label="Nome do documento" hint="FAQ, manual ou orientação (PDF) — até 10 anexos.">
                    <Textfield value={newDoc} onChange={setNewDoc} placeholder="Ex: FAQ Vale-Transporte" />
                </Field>
            </Modal>
        </div>
    );
}

/* ─── Analista de RH panel ─── */
function AnalistaScreen({ onOpenFlyout }) {
    const [tab, setTab] = useStateS('visao');
    const [viewColab, setViewColab] = useStateS(null);
    const [editPolicy, setEditPolicy] = useStateS(null);
    const [newPolicyOpen, setNewPolicyOpen] = useStateS(false);
    const [newPolicyType, setNewPolicyType] = useStateS(null);
    const [extraPolicies, setExtraPolicies] = useStateS([]);
    const toast = useToast();

    if (newPolicyType) {
        return <NewPolicyEditor
            type={newPolicyType}
            onBack={() => setNewPolicyType(null)}
            onSaved={p => { setExtraPolicies(list => [...list, p]); setNewPolicyType(null); }}
        />;
    }

    if (editPolicy) {
        if (editPolicy.id === 'vt') return <TransportPolicyEditor policy={editPolicy} onBack={() => setEditPolicy(null)} />;
        return <HealthPolicyEditor policy={editPolicy} onBack={() => setEditPolicy(null)} />;
    }

    if (viewColab) {
        return <CollaboratorDetail colab={viewColab} onBack={() => setViewColab(null)} />;
    }

    return (
        <div className="app-main-inner">
            <div className="bx-header bx-divider">
                <h1>Gestão de Benefícios</h1>
                <Breadcrumb onHome={onOpenFlyout} items={[
                    { label: 'Gestão de Benefícios', onClick: onOpenFlyout },
                    { label: 'Analista de RH' },
                ]} />
            </div>

            <Tabs
                items={[
                    { id: 'visao',          label: 'Visão Geral' },
                    { id: 'analytics',      label: 'Analytics' },
                    { id: 'acompanhamento', label: 'Acompanhamento' },
                ]}
                active={tab} onChange={setTab}
            />

            <div className="bx-body">
                {tab === 'visao' && (
                    <>
                        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
                            <Kpi icon="fa-file-alt" soft="soft-blue" label="Total de Políticas" value="3" />
                            <Kpi icon="fa-cog"      soft="soft-blue" label="Políticas Ativas"  value="2" />
                            <Kpi icon="fa-users"    soft="soft-blue" label="Beneficiários"     value="450" />
                            <Kpi icon="fa-file-alt" soft="soft-blue" label="Em Revisão"        value="1" />
                        </div>
                        <div className="bx-cards">
                            {[...RH_POLICIES, ...extraPolicies].map(p => (
                                <BenefitCard key={p.id} {...p}
                                    onClick={() => {
                                        if (p.id === 'ps' || p.id === 'vt') { setEditPolicy(p); return; }
                                        toast({
                                            kind: p.status === 'Ativa' ? 'info' : 'succ',
                                            title: p.title,
                                            message: p.status === 'Ativa'
                                                ? 'Abrindo configuração de regras e condições da política.'
                                                : 'Iniciando ativação desta política de benefício.'
                                        });
                                    }}
                                />
                            ))}
                            <button className="np-addcard" onClick={() => setNewPolicyOpen(true)}>
                                <span className="np-addcard-ic"><i className="fa fa-plus" /></span>
                                <span className="np-addcard-title">Adicionar nova política</span>
                                <span className="np-addcard-desc">Crie uma nova política de benefício para sua empresa.</span>
                                <span className="np-addcard-link">Clique para criar <i className="fa fa-arrow-right" /></span>
                            </button>
                        </div>
                        <NewPolicyModal
                            open={newPolicyOpen}
                            onClose={() => setNewPolicyOpen(false)}
                            onPick={t => { setNewPolicyOpen(false); setNewPolicyType(t); }}
                        />
                    </>
                )}

                {tab === 'analytics' && (
                    <>
                        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
                            <Kpi icon="fa-percentage"  soft="soft-green"  label="Taxa de adesão geral" value="78%" />
                            <Kpi icon="fa-coins"       soft="soft-blue"   label="Custo mensal total"   value="R$ 312 mil" />
                            <Kpi icon="fa-user-plus"   soft="soft-orange" label="Novas adesões (mês)"  value="34" />
                        </div>
                        <div className="grid grid-2 gap-16">
                            <Panel title="Adesão por benefício">
                                {[
                                    { l: 'Plano de Saúde',      v: 92, c: 'var(--sds-criticality-red)' },
                                    { l: 'Vale-Transporte',     v: 78, c: 'var(--sds-primary)' },
                                    { l: 'Vale-Refeição',       v: 64, c: 'var(--sds-criticality-orange)' },
                                    { l: 'Plano Odontológico',  v: 41, c: 'var(--sds-criticality-green)' },
                                    { l: 'Seguro de Vida',      v: 28, c: '#6B4FBB' },
                                ].map((b, i) => (
                                    <div className="bar-row" key={i}>
                                        <span className="bar-label">{b.l}</span>
                                        <span className="bar-track"><span className="bar-fill" style={{ width: b.v + '%', background: b.c }} /></span>
                                        <span className="bar-val">{b.v}%</span>
                                    </div>
                                ))}
                            </Panel>
                            <Panel title="Distribuição de custo">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                                    <div style={{
                                        width: 150, height: 150, borderRadius: '50%', flex: '0 0 auto',
                                        background: 'conic-gradient(var(--sds-criticality-red) 0 48%, var(--sds-primary) 48% 73%, var(--sds-criticality-orange) 73% 89%, var(--sds-criticality-green) 89% 100%)'
                                    }}>
                                        <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#fff', margin: '33px auto 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: 11, color: 'var(--sds-fg-muted)' }}>Total</span>
                                            <span style={{ fontSize: 15, fontWeight: 700 }}>R$ 312k</span>
                                        </div>
                                    </div>
                                    <div className="legend" style={{ flex: 1 }}>
                                        {[
                                            { l: 'Plano de Saúde',     v: 'R$ 150k', c: 'var(--sds-criticality-red)' },
                                            { l: 'Vale-Transporte',    v: 'R$ 78k',  c: 'var(--sds-primary)' },
                                            { l: 'Vale-Refeição',      v: 'R$ 50k',  c: 'var(--sds-criticality-orange)' },
                                            { l: 'Outros',             v: 'R$ 34k',  c: 'var(--sds-criticality-green)' },
                                        ].map((s, i) => (
                                            <div className="legend-item" key={i}>
                                                <span className="sw" style={{ background: s.c }} />
                                                {s.l}<span className="lg-val">{s.v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Panel>
                        </div>
                    </>
                )}

                {tab === 'acompanhamento' && (
                    <RHCollaboratorsTracking onView={setViewColab} toast={toast} />
                )}
            </div>
        </div>
    );
}

Object.assign(window, { InicialScreen, ColaboradorScreen, AnalistaScreen, NotificationCenter });
