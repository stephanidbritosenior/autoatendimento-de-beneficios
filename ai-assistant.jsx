/* Assistente de Benefícios — guided journey (floating).
   Scripted step-by-step flow + real AI (window.claude) for free questions/FAQ.
   Loaded after benefits.jsx. Exports AIAssistant to window. */

const { useState: useStateAI, useRef: useRefAI, useEffect: useEffectAI } = React;

/* ── Benefit specifications: actions, required docs, downloadable forms ── */
const BSPECS = [
    { id:'saude', name:'Plano de Saúde', tile:'tile-red', icon:'fa-heart', desc:'Cobertura médica e hospitalar',
      actions:[ {label:'Aderir', tipo:'Adesão'}, {label:'Incluir Dependentes', tipo:'Inclusão'} ],
      required:[ {n:'CPF', s:'Documento de identificação fiscal do dependente', depOnly:true}, {n:'Documento de Identidade (RG)', s:'Identidade do dependente (ou CNH)', depOnly:true}, {n:'Certidão de Nascimento ou Casamento', s:'Comprova o vínculo com o dependente', depOnly:true} ],
      downloads:[ {n:'Carta de Portabilidade', s:'Documento necessário para portabilidade'}, {n:'Formulário de Inclusão de Dependente', s:'Para adicionar dependentes ao plano', depOnly:true}, {n:'Termo de Adesão', s:'Termo de aceite do benefício'} ] },
    { id:'vt', name:'Vale-Transporte', tile:'tile-blue', icon:'fa-bus', desc:'Benefício para deslocamento',
      actions:[ {label:'Aderir', tipo:'Inclusão'} ],
      required:[],
      downloads:[] },
    { id:'odonto', name:'Plano Odontológico', tile:'tile-green', icon:'fa-tooth', desc:'Cobertura para tratamentos dentários',
      actions:[ {label:'Aderir', tipo:'Adesão'}, {label:'Adicionar Dependente', tipo:'Inclusão'} ],
      required:[ {n:'CPF', s:'Documento de identificação fiscal do dependente', depOnly:true}, {n:'Documento de Identidade (RG)', s:'Identidade do dependente (ou CNH)', depOnly:true} ],
      downloads:[ {n:'Termo de Adesão Odontológico', s:'Termo de aceite do plano'}, {n:'Formulário de Inclusão de Dependente', s:'Para adicionar dependentes', depOnly:true} ] },
    { id:'refeicao', name:'Vale-Refeição', tile:'tile-orange', icon:'fa-utensils', desc:'Crédito diário para alimentação',
      actions:[ {label:'Aderir', tipo:'Adesão'} ],
      required:[ {n:'CPF', s:'Documento de identificação fiscal'} ],
      downloads:[ {n:'Termo de Adesão', s:'Termo de aceite do benefício'} ] },
    { id:'seguro', name:'Seguro de Vida', tile:'tile-purple', icon:'fa-shield-alt', desc:'Proteção financeira para sua família',
      actions:[ {label:'Aderir', tipo:'Adesão'}, {label:'Indicar Beneficiários', tipo:'Inclusão'} ],
      required:[ {n:'CPF', s:'Documento de identificação fiscal'}, {n:'Ficha de beneficiários', s:'Indicação dos beneficiários do seguro'} ],
      downloads:[ {n:'Ficha de Indicação de Beneficiários', s:'Indique quem receberá o seguro'}, {n:'Termo de Adesão', s:'Termo de aceite do benefício'} ] },
    { id:'creche', name:'Auxílio Creche', tile:'tile-teal', icon:'fa-baby', desc:'Reembolso de creche para filhos até 5 anos',
      actions:[ {label:'Concluir adesão', tipo:'Adesão'} ],
      required:[ {n:'Certidão de Nascimento', s:'Do(s) filho(s) até 5 anos'}, {n:'Comprovante de matrícula', s:'Creche ou pré-escola'}, {n:'Recibo de pagamento', s:'Mensalidade da creche'} ],
      downloads:[ {n:'Formulário de Auxílio Creche', s:'Dados da creche e valores'}, {n:'Termo de Adesão', s:'Termo de aceite do benefício'} ] },
];
const specOf = id => BSPECS.find(b => b.id === id);

const TITULAR = [
    ['CEP', '89010-000'], ['Bairro', 'Velha'],
    ['Logradouro', 'Rua das Palmeiras, 245'], ['Cidade', 'Blumenau'],
    ['Complemento', 'Apto 302, Bloco B'], ['Estado', 'Santa Catarina - SC'],
];

/* Extra guided steps inserted (after Dados do Titular) for health-type benefits */
const FLOW = { saude: ['portabilidade', 'planoConfig', 'dependentes'], odonto: ['portabilidade', 'planoConfig', 'dependentes'] };
const OPERADORAS_SAUDE = ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Hapvida', 'NotreDame Intermédica'];
const OPERADORAS_ODONTO = ['Uniodonto', 'Bradesco Dental', 'Amil Dental', 'SulAmérica Odonto', 'OdontoPrev'];
const PARENTESCOS = ['Cônjuge', 'Filho(a)', 'Pai/Mãe', 'Companheiro(a)', 'Outro'];
const DEPS = [
    { id:'d1', nome:'Maria Fernanda Lima', rel:'Cônjuge',  cpf:'123.456.789-01', nasc:'14/05/1992' },
    { id:'d2', nome:'Pedro Henrique Lima', rel:'Filho(a)', cpf:'987.654.321-09', nasc:'21/08/2015' },
    { id:'d3', nome:'Ana Clara Lima',      rel:'Filho(a)', cpf:'456.789.123-45', nasc:'29/11/2018' },
];
const initForm = () => ({ portab: null, operadoraAtual: '', operadora: '', abrangencia: '', acomodacao: '', planoTipo: '', selectedDeps: [], newDeps: [], excMotivo: '', excConfirm: false, revConfirm: false, linha: '', outroMeio: null, qtdPasses: '', possuiCartao: null, tipoCartao: null, cartaoUnico: '', cartoes: {} });
const MOTIVOS_EXCLUSAO = ['Não utilizo mais o benefício', 'Custo elevado / desconto em folha', 'Contratei plano por conta própria', 'Mudança de operadora', 'Desligamento de dependente', 'Outro'];
const CARD_TO_SPEC = { vt: 'vt', ps: 'saude', po: 'odonto', refeicao: 'refeicao', seguro: 'seguro' };
const MEIOS_TRANSPORTE = ['Ônibus', 'Metrô', 'Carro', 'Fretado', 'Trem'];
const LINHAS_TRANSPORTE = [
    { id: 'blumob',    nome: 'BLUMOB',     area: 'Blumenau/SC' },
    { id: 'intersiga', nome: 'InterSiga',  area: 'Blumenau, Gaspar, Ilhota, Indaial, Luiz Alves e Pomerode/SC' },
    { id: 'cartaobom', nome: 'Cartão Bom', area: 'Região Metropolitana de São Paulo/SP' },
    { id: 'sptrans',   nome: 'SP Trans',   area: 'São Paulo/SP' },
    { id: 'riocard',   nome: 'Rio Card',   area: 'Rio de Janeiro/RJ' },
];

const MENUS = {
    colaborador: [
        { id:'solicitar', icon:'fa-file-signature', label:'Fazer solicitação de benefício' },
        { id:'faq',       icon:'fa-regular fa-file-lines', label:'Meus benefícios' },
        { id:'acomp',     icon:'fa-list-check',      label:'Acompanhar solicitação de benefícios' },
    ],
    analista: [
        { id:'aprovar',   icon:'fa-user-check',  label:'Aprovar solicitações pendentes' },
        { id:'politicas', icon:'fa-sliders',     label:'Consultar políticas de benefícios' },
        { id:'faq',       icon:'fa-chart-line',  label:'Análises e perguntas à IA' },
    ],
};

const AI_GROUND = {
    colaborador: `Você atende um COLABORADOR. Benefícios: Vale-Transporte (ativo, 6% do salário), Plano de Saúde (ativo, individual/familiar), Plano Odontológico (disponível), Vale-Refeição (R$ 35/dia), Seguro de Vida (até R$ 200 mil), Auxílio Creche (filhos até 5 anos). Para aderir, oriente o colaborador a usar a opção "Fazer solicitação de benefício" do assistente.`,
    analista: `Você atende um ANALISTA DE RH. 3 políticas (Vale-Transporte e Plano de Saúde ativas; Plano Odontológico inativa), 450 beneficiários, adesão geral 78%, custo mensal R$ 312 mil. Adesão: Saúde 92%, VT 78%, Refeição 64%, Odonto 41%, Seguro 28%. Há 3 solicitações pendentes de aprovação.`,
};

function downloadDoc(docName, benefitName) {
    const linhas = [
        'SENIOR SISTEMAS — Gestão de Benefícios',
        '==========================================',
        `Documento: ${docName}`,
        `Benefício: ${benefitName}`,
        `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
        '',
        'Preencha os campos abaixo, salve o arquivo e anexe na etapa de envio.',
        '------------------------------------------',
        'Nome completo: ____________________________',
        'CPF: ______________________  RG: __________',
        'Data de nascimento: ___/___/______',
        'Matrícula: ______________  Filial: ________',
        '',
        'Dependentes / beneficiários (se aplicável):',
        '1) Nome: ________________ Parentesco: ______',
        '2) Nome: ________________ Parentesco: ______',
        '',
        'Declaro que as informações são verdadeiras.',
        '',
        'Assinatura: _______________  Data: ___/___/______',
    ];
    const blob = new Blob([linhas.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = docName.replace(/[^\wÀ-ÿ]+/g, '_') + '.txt';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const hhmm = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

function AIAssistant({ role = 'colaborador' }) {
    const [open, setOpen] = useStateAI(false);
    const [entry, setEntry] = useStateAI(null);   // ponto de entrada vindo dos cards de benefício
    const [msgs, setMsgs] = useStateAI([]);
    const [input, setInput] = useStateAI('');
    const [busy, setBusy] = useStateAI(false);
    const [mode, setMode] = useStateAI('menu');      // menu | faq
    const [uploads, setUploads] = useStateAI({});    // docName -> filename (current flow)
    const [form, setForm] = useStateAI(initForm());  // collected data for the current flow
    const bodyRef = useRefAI(null);
    const toast = useToast();

    const greeting = 'Olá! 👋 Sou o Assistente de Benefícios. Como posso ajudá-lo hoje?';

    // Abertura direta a partir dos cards de benefício (Solicitar / Gerenciar).
    useEffectAI(() => {
        const h = e => { setEntry({ ...(e.detail || {}), n: Date.now() }); setOpen(true); };
        window.addEventListener('sds-open-assistant', h);
        return () => window.removeEventListener('sds-open-assistant', h);
    }, []);

    // Recomeça a conversa do zero toda vez que o chat é aberto (uma etapa por vez).
    useEffectAI(() => {
        if (!open) { if (entry) setEntry(null); return; }
        setMode('menu'); setUploads({}); setInput(''); setForm(initForm());
        const spec = entry && BSPECS.find(b => b.id === CARD_TO_SPEC[entry.benefitId] || b.id === entry.benefitId);
        if (spec) {
            const base = [{ from: 'bot', kind: 'text', text: greeting, time: hhmm() }];
            if (entry.entry === 'gerenciar') {
                setMsgs([...base,
                    { from: 'user', kind: 'utext', text: `Gerenciar — ${spec.name}`, time: hhmm() },
                    { from: 'bot', kind: 'actionPicker', benefitId: spec.id, time: hhmm() }]);
            } else {
                setMsgs([...base,
                    { from: 'user', kind: 'utext', text: `Solicitar — ${spec.name}`, time: hhmm() },
                    { from: 'bot', kind: 'titular', benefitId: spec.id, tipo: (spec.actions[0] && spec.actions[0].tipo) || 'Adesão', time: hhmm() }]);
            }
            return;
        }
        setMsgs([
            { from: 'bot', kind: 'text', text: greeting, time: hhmm() },
            { from: 'bot', kind: 'menu', options: MENUS[role] || MENUS.colaborador, time: hhmm() },
        ]);
    }, [open, entry]);

    useEffectAI(() => {
        const c = bodyRef.current;
        if (!c) return;
        const bots = c.querySelectorAll('.aim-bot');
        const last = bots[bots.length - 1];
        if (last) {
            const top = last.offsetTop - c.offsetTop - 12;
            c.scrollTo({ top: Math.min(top, c.scrollHeight - c.clientHeight), behavior: 'smooth' });
        } else {
            c.scrollTop = c.scrollHeight;
        }
    }, [msgs, busy, uploads, open]);

    const add = (...items) => setMsgs(p => [...p, ...items.map(m => ({ time: hhmm(), ...m }))]);
    const addUser = text => add({ from: 'user', kind: 'utext', text });

    const backToMenu = () => { setMode('menu'); add({ from: 'bot', kind: 'text', text: 'Posso ajudar em algo mais?' }, { from: 'bot', kind: 'menu', options: MENUS[role] || MENUS.colaborador }); };

    // ── Menu routing ──
    const handleMenu = (opt) => {
        addUser(opt.label);
        if (opt.id === 'solicitar') add({ from: 'bot', kind: 'benefitPicker' });
        else if (opt.id === 'faq') { setMode('faq'); add({ from: 'bot', kind: 'text', text: 'Claro! Pergunte o que quiser sobre os benefícios — coberturas, descontos, prazos, dependentes. Escreva sua dúvida abaixo.' }); }
        else if (opt.id === 'acomp') add({ from: 'bot', kind: 'tracking' });
        else if (opt.id === 'aprovar') add({ from: 'bot', kind: 'approvals' });
        else if (opt.id === 'politicas') add({ from: 'bot', kind: 'policies' });
    };

    const chooseBenefit = (benefit) => {
        addUser(benefit.name);
        add({ from: 'bot', kind: 'actionPicker', benefitId: benefit.id });
    };

    const chooseAction = (benefit, action) => {
        addUser(`${action.label} — ${benefit.name}`);
        setUploads({}); setForm(initForm());
        add({ from: 'bot', kind: 'titular', benefitId: benefit.id, tipo: action.tipo });
    };

    // Após os documentos, encaminha para as etapas extras (portabilidade → planoConfig → dependentes) e então o anexo.
    const nextStep = (benefitId, tipo, current) => {
        const f = FLOW[benefitId] || [];
        const idx = current ? f.indexOf(current) : -1;
        if (f.length && idx < f.length - 1) add({ from: 'bot', kind: f[idx + 1], benefitId, tipo });
        else add({ from: 'bot', kind: 'upload', benefitId, tipo });
    };
    // "Voltar": remove the current step card (and anything after it) to return to the previous step.
    const goBack = (kind) => setMsgs(prev => { const i = prev.map(x => x.kind).lastIndexOf(kind); return i >= 0 ? prev.slice(0, i) : prev; });

    const onUpload = (docName, file) => { if (file) setUploads(u => ({ ...u, [docName]: file.name })); };

    const submitRequest = (benefit, tipo) => {
        const protocol = '#' + (Math.floor(Math.random() * 9000) + 1000);
        add({ from: 'bot', kind: 'success', benefitName: benefit.name, protocol });
        toast({ kind: 'succ', title: 'Solicitação enviada', message: `${tipo} — ${benefit.name} · Protocolo ${protocol}` });
        setUploads({});
    };

    // ── Free text / FAQ via Claude ──
    const send = async (textRaw) => {
        const text = (textRaw != null ? textRaw : input).trim();
        if (!text || busy) return;
        addUser(text); setInput(''); setBusy(true);
        try {
            let reply;
            if (window.claude && window.claude.complete) {
                const prompt = `Você é o Assistente de Benefícios da Senior Sistemas. ${AI_GROUND[role]}
Responda em português do Brasil, de forma profissional e concisa (máx. ~100 palavras), tratando por "você". Use apenas as informações acima; se não souber, diga que encaminhará ao RH. Não use emojis.

Pergunta do usuário: ${text}
Resposta:`;
                reply = await window.claude.complete(prompt);
            }
            if (!reply) reply = 'No momento não consegui responder. Você pode usar as opções do menu ou tentar novamente.';
            add({ from: 'bot', kind: 'text', text: reply.trim() });
        } catch (e) {
            add({ from: 'bot', kind: 'text', text: 'Tive um problema para responder agora. Tente novamente em instantes.' });
        } finally { setBusy(false); }
    };

    if (!open) {
        return (
            <button className="ai-fab" onClick={() => setOpen(true)} aria-label="Abrir assistente de benefícios">
                <span className="ai-pulse" />
                <i className="fa fa-comment-dots" />
                <span className="ai-spark"><i className="fa fa-wand-magic-sparkles" /></span>
            </button>
        );
    }

    return (
        <div className="ai-backdrop">
            <div className="ai-modal" role="dialog" aria-label="Assistente de Benefícios">
                <div className="ai-head">
                    <div className="ai-ava"><i className="fa fa-comment-dots" /></div>
                    <div className="ai-id">
                        <div className="ai-name">Assistente de Benefícios</div>
                        <div className="ai-status"><span className="dot" /> Online</div>
                    </div>
                    <span className="ai-x" onClick={() => setOpen(false)}><i className="fa fa-times" /></span>
                </div>

                <div className="ai-body" ref={bodyRef}>
                    {msgs.map((m, i) => <MsgView key={i} m={m}
                        onMenu={handleMenu} onBenefit={chooseBenefit} onAction={chooseAction}
                        uploads={uploads} onUpload={onUpload} form={form} setForm={setForm}
                        add={add} backToMenu={backToMenu} nextStep={nextStep} goBack={goBack}
                        submitRequest={submitRequest} toast={toast} />)}
                    {busy && <div className="aim-bot" style={{ borderLeftColor: 'var(--sds-primary)' }}><span className="ai-typing"><span /><span /><span /></span></div>}
                </div>

                <div className="ai-input">
                    <input value={input} placeholder="Digite sua mensagem..."
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') send(); }}
                        disabled={busy} />
                    <button className="ai-send" onClick={() => send()} disabled={busy || !input.trim()} aria-label="Enviar">
                        <i className="fa fa-paper-plane" />
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Renders a single message by kind ── */
function MsgView({ m, onMenu, onBenefit, onAction, uploads, onUpload, form, setForm, add, backToMenu, nextStep, goBack, submitRequest, toast }) {
    const Time = () => <div className={`ai-time ${m.from === 'user' ? 'user' : ''}`}>{m.time}</div>;

    if (m.from === 'user') return <><div className="aim-user">{m.text}</div><Time /></>;

    if (m.kind === 'text') return <><div className="aim-bot plain">{m.text}</div><Time /></>;

    if (m.kind === 'menu') return <>
        {m.options.map(o => (
            <button key={o.id} className="aim-opt" onClick={() => onMenu(o)}><i className={`fa ${o.icon}`} />{o.label}</button>
        ))}
        <Time />
    </>;

    if (m.kind === 'benefitPicker') return <>
        <div className="aim-bot">
            <div className="aim-lead">Escolha o benefício que deseja solicitar:</div>
            {BSPECS.map(b => (
                <button key={b.id} className="aim-benefit picker" onClick={() => onBenefit(b)}>
                    <div className={`ab-tile ${b.tile}`}><i className={`fa ${b.icon}`} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="ab-name">{b.name}</div>
                        <div className="ab-desc">{b.desc}</div>
                    </div>
                    <i className="fa fa-chevron-right" style={{ color: 'var(--sds-fg-subtle)' }} />
                </button>
            ))}
            <div className="aim-foot"><Button priority="default" onClick={backToMenu}>Cancelar</Button></div>
        </div>
        <Time />
    </>;

    if (m.kind === 'actionPicker') {
        const b = specOf(m.benefitId);
        return <>
            <div className="aim-bot">
                <div className="aim-lead">O que você deseja fazer com <b>{b.name}</b>?</div>
                <div className="aim-btnrow">
                    <Button priority="primary" size="small" onClick={() => onAction(b, { label: 'Solicitar', tipo: b.actions[0]?.tipo || 'Adesão' })}>Solicitar</Button>
                    <Button priority="secondary" size="small" onClick={() => onAction(b, { label: 'Alterar', tipo: 'Alteração' })}>Alterar</Button>
                    <Button priority="default" size="small" className="btn-outline-red" onClick={() => onAction(b, { label: 'Excluir', tipo: 'Exclusão' })}>Excluir</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'titular') {
        const b = specOf(m.benefitId);
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-location-dot" /> Endereço do colaborador</div>
                <div className="aim-box">
                    <div className="aim-grid">
                        {TITULAR.map(([k, v]) => (
                            <div key={k}>
                                <div className="k">{k}</div><div className="v">{v}</div>
                            </div>
                        ))}
                    </div>
                    <div className="aim-divider" />
                    <span className="aim-chip"><i className="fa fa-tag" /> Tipo de ação: {m.tipo}</span>
                </div>
                <div className="aim-note"><i className="fa fa-info-circle" /> Confirme o endereço antes de prosseguir. Em caso de divergência, entre em contato com o RH.</div>
                <div className="aim-foot">
                    <Button priority="default" onClick={backToMenu}>Cancelar</Button>
                    <Button priority="primary" onClick={() => add({ from: 'bot', kind: m.tipo === 'Exclusão' ? 'exclusao' : (b.id === 'vt' ? 'linhaTransporte' : 'docsRequired'), benefitId: b.id, tipo: m.tipo })}>Continuar</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'linhaTransporte') {
        const b = specOf(m.benefitId);
        const sel = form.linha;
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-bus" /> Qual meio de transporte você utiliza?</div>
                {MEIOS_TRANSPORTE.map(t => (
                    <button key={t} className={`aim-linecard ${sel === t ? 'sel' : ''}`} onClick={() => setForm(f => ({ ...f, linha: t }))}>
                        <div className="lc-name">{t}</div>
                    </button>
                ))}
                <div className="aim-foot">
                    <Button priority="default" onClick={backToMenu}>Cancelar</Button>
                    <Button priority="primary" disabled={!sel} onClick={() => add({ from: 'bot', kind: 'valorPasse', benefitId: b.id, tipo: m.tipo })}>Continuar</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'valorPasse') {
        const b = specOf(m.benefitId);
        const sel = form.outroMeio;
        const opts = [...MEIOS_TRANSPORTE.filter(t => t !== form.linha), 'Não utilizo outro meio de transporte'];
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-bus" /> Você utiliza algum outro meio de transporte?</div>
                {opts.map(t => (
                    <button key={t} className={`aim-linecard ${sel === t ? 'sel' : ''}`} onClick={() => setForm(f => ({ ...f, outroMeio: t }))}>
                        <div className="lc-name">{t}</div>
                    </button>
                ))}
                <div className="aim-foot">
                    <Button priority="default" onClick={backToMenu}>Cancelar</Button>
                    <Button priority="primary" disabled={!sel} onClick={() => add({ from: 'bot', kind: 'qtdPasses', benefitId: b.id, tipo: m.tipo })}>Continuar</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'qtdPasses') {
        const b = specOf(m.benefitId);
        const n = parseInt(form.qtdPasses, 10);
        const valid = n > 0;
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-ticket" /> Quantos passes de transporte você usa por dia (ida e volta)?</div>
                <div className="aim-flabel">Quantidade de passes <span className="req">*</span></div>
                <input className="aim-text" type="number" min="1" step="1" placeholder="Digite a quantidade" value={form.qtdPasses} onChange={e => setForm(f => ({ ...f, qtdPasses: e.target.value }))} />
                {form.qtdPasses !== '' && !valid && <div className="aim-err">Informe um número válido de passes.</div>}
                <div className="aim-foot">
                    <Button priority="default" onClick={backToMenu}>Cancelar</Button>
                    <Button priority="primary" disabled={!valid} onClick={() => add({ from: 'bot', kind: 'possuiCartao', benefitId: b.id, tipo: m.tipo })}>Continuar</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'possuiCartao') {
        const b = specOf(m.benefitId);
        const sel = form.possuiCartao;
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-credit-card" /> Você possui cartão de transporte?</div>
                {['Sim, tenho o cartão', 'Não tenho'].map(o => (
                    <button key={o} className={`aim-linecard ${sel === o ? 'sel' : ''}`} onClick={() => setForm(f => ({ ...f, possuiCartao: o }))}>
                        <div className="lc-name">{o}</div>
                    </button>
                ))}
                <div className="aim-foot">
                    <Button priority="default" onClick={backToMenu}>Cancelar</Button>
                    <Button priority="primary" disabled={!sel} onClick={() => add({ from: 'bot', kind: sel === 'Não tenho' ? 'confirmVT' : 'tipoCartao', benefitId: b.id, tipo: m.tipo })}>Continuar</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'tipoCartao') {
        const b = specOf(m.benefitId);
        const sel = form.tipoCartao;
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-credit-card" /> Como você deseja informar o cartão de transporte?</div>
                {['Um cartão para cada passe', 'Um cartão único para todos os passes'].map(o => (
                    <button key={o} className={`aim-linecard ${sel === o ? 'sel' : ''}`} onClick={() => setForm(f => ({ ...f, tipoCartao: o }))}>
                        <div className="lc-name">{o}</div>
                    </button>
                ))}
                <div className="aim-foot">
                    <Button priority="default" onClick={backToMenu}>Cancelar</Button>
                    <Button priority="primary" disabled={!sel} onClick={() => add({ from: 'bot', kind: 'numeroCartao', benefitId: b.id, tipo: m.tipo })}>Continuar</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'numeroCartao') {
        const b = specOf(m.benefitId);
        const unico = form.tipoCartao === 'Um cartão único para todos os passes';
        const n = parseInt(form.qtdPasses, 10) || 1;
        const idx = Array.from({ length: n }, (_, i) => i + 1);
        const valid = unico ? String(form.cartaoUnico).trim().length > 0 : idx.every(i => String(form.cartoes[i] || '').trim().length > 0);
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-credit-card" /> {unico ? 'Informe o número do cartão único' : 'Informe o número de cada cartão'}</div>
                {unico
                    ? <input className="aim-text" placeholder="Digite o número do cartão" value={form.cartaoUnico} onChange={e => setForm(f => ({ ...f, cartaoUnico: e.target.value }))} />
                    : idx.map(i => (
                        <div key={i} style={{ marginBottom: 12 }}>
                            <div className="aim-flabel">Cartão do passe {i}</div>
                            <input className="aim-text" placeholder="Digite o número do cartão" value={form.cartoes[i] || ''} onChange={e => setForm(f => ({ ...f, cartoes: { ...f.cartoes, [i]: e.target.value } }))} />
                        </div>
                    ))}
                <div className="aim-foot">
                    <Button priority="default" onClick={backToMenu}>Cancelar</Button>
                    <Button priority="primary" disabled={!valid} onClick={() => add({ from: 'bot', kind: 'confirmVT', benefitId: b.id, tipo: m.tipo })}>Continuar</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'confirmVT') {
        const b = specOf(m.benefitId);
        const linha = form.linha;
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-circle-check" /> Confirme sua Solicitação</div>
                <div className="aim-box">
                    <div className="aim-grid">
                        <div><div className="k">Tipo de Solicitação</div><div className="v">{m.tipo}</div></div>
                        <div><div className="k">Meio de Transporte</div><div className="v">{linha || '—'}</div></div>
                        <div><div className="k">Outro meio de transporte</div><div className="v">{form.outroMeio || '—'}</div></div>
                        <div><div className="k">Passes por dia (ida e volta)</div><div className="v">{form.qtdPasses || '—'}</div></div>
                        <div><div className="k">Cartão de transporte</div><div className="v">{form.possuiCartao === 'Não tenho' ? 'Não possui' : (form.tipoCartao || '—')}</div></div>
                        {form.possuiCartao !== 'Não tenho' && <div style={{ gridColumn: '1 / -1' }}><div className="k">{form.tipoCartao === 'Um cartão único para todos os passes' ? 'Número do cartão' : 'Números dos cartões'}</div><div className="v">{form.tipoCartao === 'Um cartão único para todos os passes' ? (form.cartaoUnico || '—') : (Object.values(form.cartoes).filter(Boolean).join(' · ') || '—')}</div></div>}
                    </div>
                </div>
                <div className="aim-foot">
                    <Button priority="default" onClick={() => goBack('confirmVT')}>Voltar</Button>
                    <Button priority="primary" icon="fa-circle-check" onClick={() => submitRequest(b, m.tipo)}>Confirmar Solicitação</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'exclusao') {
        const b = specOf(m.benefitId);
        const valid = form.excMotivo && form.excConfirm;
        return <>
            <div className="aim-bot">
                <div className="aim-card-title" style={{ color: 'var(--sds-criticality-red)' }}><i className="fa fa-triangle-exclamation" style={{ color: 'var(--sds-criticality-red)' }} /> Exclusão de Benefício</div>
                <div className="aim-box">
                    <div className="ab-top" style={{ marginBottom: 0, flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                        <div className={`ab-tile ${b.tile}`} style={{ backgroundColor: 'transparent', width: 'auto', height: 'auto', color: 'var(--sds-fg-default)', fontSize: 22 }}><i className={`fa ${b.icon}`} /></div>
                        <div>
                            <div className="ab-name" style={{ marginBottom: 8 }}>{b.name}</div>
                            <div className="ab-desc">Titular: Carlos Eduardo Lima · Matrícula 001234</div>
                        </div>
                    </div>
                </div>
                <div className="aim-flabel" style={{ marginTop: 4 }}>Motivo da exclusão <span className="req">*</span></div>
                <select className="aim-select" value={form.excMotivo || ''} onChange={e => setForm(f => ({ ...f, excMotivo: e.target.value }))}>
                    <option value="">Selecione o motivo</option>
                    {MOTIVOS_EXCLUSAO.map(mo => <option key={mo} value={mo}>{mo}</option>)}
                </select>
                <label className="aim-confirm">
                    <span className={`cb ${form.excConfirm ? 'checked' : ''}`} onClick={() => setForm(f => ({ ...f, excConfirm: !f.excConfirm }))}>{form.excConfirm && <i className="fa fa-check" />}</span>
                    <span>Estou ciente de que a exclusão é definitiva e encerra o benefício e suas coberturas.</span>
                </label>
                <div className="aim-foot">
                    <Button priority="default" onClick={() => goBack('exclusao')}>Voltar</Button>
                    <Button priority="primary" className="btn-danger" icon="fa-trash" disabled={!valid} onClick={() => submitRequest(b, 'Exclusão')}>Confirmar exclusão</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'portabilidade') {
        const b = specOf(m.benefitId);
        const has = form.portab;
        const okSim = has === 'sim' && (form.operadoraAtual || '').trim();
        const valid = has === 'nao' || okSim;
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className={`fa ${b.icon}`} /> Portabilidade</div>
                <div className="aim-q">Você possui plano {b.id === 'odonto' ? 'odontológico' : 'de saúde'} ativo em outra operadora? <span className="req">*</span></div>
                <div className="aim-2col">
                    <button className={`aim-choice ${has === 'sim' ? 'sel' : ''}`} onClick={() => setForm(f => ({ ...f, portab: 'sim' }))}>Sim</button>
                    <button className={`aim-choice ${has === 'nao' ? 'sel' : ''}`} onClick={() => setForm(f => ({ ...f, portab: 'nao', operadoraAtual: '' }))}>Não</button>
                </div>
                {!has && <div className="aim-err">Selecione uma opção.</div>}
                {has === 'sim' && <>
                    <div style={{ marginTop: 14 }}>
                        <div className="aim-flabel">Operadora Atual <span className="req">*</span></div>
                        <input className="aim-text" placeholder="Ex: Unimed, Bradesco Saúde, SulAmérica" value={form.operadoraAtual || ''} onChange={e => setForm(f => ({ ...f, operadoraAtual: e.target.value }))} />
                        {!okSim && <div className="aim-err">Informe a operadora atual.</div>}
                    </div>
                    <div className="aim-note"><i className="fa fa-info-circle" /> Você precisará anexar a <b>Carta de Portabilidade</b> (já disponível para download) na etapa de Anexos.</div>
                </>}
                <div className="aim-foot">
                    <Button priority="default" onClick={() => goBack('portabilidade')}>Voltar</Button>
                    <Button priority="primary" disabled={!valid} onClick={() => nextStep(b.id, m.tipo, 'portabilidade')}>Continuar</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'planoConfig') {
        const b = specOf(m.benefitId);
        const isOdonto = b.id === 'odonto';
        const ops = isOdonto ? OPERADORAS_ODONTO : OPERADORAS_SAUDE;
        const valid = form.operadora && (isOdonto ? form.planoTipo : (form.abrangencia && form.acomodacao));
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className={`fa ${b.icon}`} /> Operadora e Plano</div>
                <div className="aim-flabel">Operadora <span className="req">*</span></div>
                <select className="aim-select" value={form.operadora || ''} onChange={e => setForm(f => ({ ...f, operadora: e.target.value }))}>
                    <option value="">Selecione a operadora</option>
                    {ops.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {isOdonto ? <>
                    <div className="aim-flabel" style={{ marginTop: 14 }}>Plano <span className="req">*</span></div>
                    <div className="aim-seg">
                        {['Básico', 'Completo'].map(x => <button key={x} className={`aim-segbtn ${form.planoTipo === x ? 'sel' : ''}`} onClick={() => setForm(f => ({ ...f, planoTipo: x }))}>{x}</button>)}
                    </div>
                </> : <>
                    <div className="aim-flabel" style={{ marginTop: 14 }}>Abrangência <span className="req">*</span></div>
                    <div className="aim-seg">
                        {['Regional', 'Estadual', 'Nacional'].map(x => <button key={x} className={`aim-segbtn ${form.abrangencia === x ? 'sel' : ''}`} onClick={() => setForm(f => ({ ...f, abrangencia: x }))}>{x}</button>)}
                    </div>
                    <div className="aim-flabel" style={{ marginTop: 14 }}>Acomodação <span className="req">*</span></div>
                    <div className="aim-seg">
                        {['Enfermaria', 'Apartamento'].map(x => <button key={x} className={`aim-segbtn ${form.acomodacao === x ? 'sel' : ''}`} onClick={() => setForm(f => ({ ...f, acomodacao: x }))}>{x}</button>)}
                    </div>
                </>}
                <div className="aim-note warn"><i className="fa fa-info-circle" /> Esta configuração será aplicada também aos seus dependentes.</div>
                <div className="aim-foot">
                    <Button priority="default" onClick={() => goBack('planoConfig')}>Voltar</Button>
                    <Button priority="primary" disabled={!valid} onClick={() => nextStep(b.id, m.tipo, 'planoConfig')}>Continuar</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'dependentes') {
        const b = specOf(m.benefitId);
        const sel = form.selectedDeps || [];
        const news = form.newDeps || [];
        const toggleDep = id => setForm(f => { const s = f.selectedDeps || []; return { ...f, selectedDeps: s.includes(id) ? s.filter(x => x !== id) : [...s, id] }; });
        const addNew = () => setForm(f => ({ ...f, newDeps: [...(f.newDeps || []), { nome: '', nasc: '', cpf: '', parentesco: '' }] }));
        const editNew = (i, k, v) => setForm(f => { const arr = [...(f.newDeps || [])]; arr[i] = { ...arr[i], [k]: v }; return { ...f, newDeps: arr }; });
        const delNew = i => setForm(f => { const arr = [...(f.newDeps || [])]; arr.splice(i, 1); return { ...f, newDeps: arr }; });
        const total = sel.length + news.length;
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-users" /> Dependentes (Opcional)</div>
                <div className="aim-sub-h">Dependentes já cadastrados</div>
                <div style={{ fontSize: 13, color: 'var(--sds-fg-muted)', marginBottom: 12 }}>Selecione os dependentes que deseja incluir no plano</div>
                {DEPS.map(d => (
                    <button key={d.id} className={`aim-depcard ${sel.includes(d.id) ? 'sel' : ''}`} onClick={() => toggleDep(d.id)}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="dp-name">{d.nome} <span className="dp-rel">{d.rel}</span></div>
                            <div className="dp-info">CPF: {d.cpf} • Nascimento: {d.nasc}</div>
                        </div>
                        {sel.includes(d.id) && <i className="fa fa-check dp-chk" />}
                    </button>
                ))}
                {sel.length > 0 && <div className="aim-note" style={{ marginBottom: 0 }}><i className="fa fa-info-circle" /> {sel.length} dependente(s) selecionado(s) da lista de dependentes já cadastrados.</div>}
                <div className="aim-or"><span>ou</span></div>
                <div className="aim-newhead">
                    <div><div className="aim-sub-h" style={{ marginBottom: 2 }}>Cadastrar novo dependente</div><div style={{ fontSize: 13, color: 'var(--sds-fg-muted)' }}>Adicione dependentes que não estão cadastrados no sistema</div></div>
                    <Button priority="primary" size="small" icon="fa-plus" onClick={addNew}>Adicionar Novo</Button>
                </div>
                {news.length === 0 ? (
                    <div className="aim-empty"><i className="fa fa-users" /><div>Nenhum novo dependente cadastrado</div><div className="s">Clique em "Adicionar Novo" para cadastrar dependentes</div></div>
                ) : (
                    <div className="aim-deptable">
                        <div className="dt-head"><span>Nome *</span><span>Data Nasc. *</span><span>CPF *</span><span>Parentesco *</span><span></span></div>
                        {news.map((nd, i) => (
                            <div className="dt-row" key={i}>
                                <input placeholder="Nome completo" value={nd.nome} onChange={e => editNew(i, 'nome', e.target.value)} />
                                <input placeholder="dd/mm/aaaa" value={nd.nasc} onChange={e => editNew(i, 'nasc', e.target.value)} />
                                <input placeholder="000.000.000-00" value={nd.cpf} onChange={e => editNew(i, 'cpf', e.target.value)} />
                                <select value={nd.parentesco} onChange={e => editNew(i, 'parentesco', e.target.value)}><option value="">Selecione</option>{PARENTESCOS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                                <button className="dt-del" title="Excluir" onClick={() => delNew(i)}><i className="fa fa-trash" /></button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="aim-note" style={{ marginBottom: 0, marginTop: 14 }}><i className="fa fa-info-circle" /> Total de {total} dependente(s) será(ão) incluído(s) no plano. Dependentes herdam exatamente o plano do titular.</div>
                <div className="aim-foot">
                    <Button priority="default" onClick={() => goBack('dependentes')}>Voltar</Button>
                    <Button priority="primary" onClick={() => nextStep(b.id, m.tipo, 'dependentes')}>Continuar</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'docsRequired') {
        const b = specOf(m.benefitId);
        const isHealth = !!FLOW[b.id];
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-file-circle-check" /> Documentos Necessários</div>
                {isHealth
                    ? <div className="aim-note"><i className="fa fa-info-circle" /> Seus documentos pessoais já constam no seu cadastro na empresa, e os de dependentes já cadastrados também. Os documentos abaixo são exigidos <b>apenas se você cadastrar um novo dependente</b>. Baixe, preencha e assine os formulários — eles serão anexados na etapa de Anexos.</div>
                    : <div className="aim-note"><i className="fa fa-info-circle" /> Prepare os documentos obrigatórios e baixe os formulários abaixo. Tudo será anexado na etapa de Anexos.</div>}
                {b.required.length > 0 && <div className="aim-box">
                    <div className="aim-card-title" style={{ fontSize: 15, marginBottom: 6 }}><i className="fa fa-file-lines" style={{ fontSize: 15 }} /> Documentos {isHealth ? 'dos dependentes' : 'obrigatórios'}</div>
                    {b.required.map(d => (
                        <div key={d.n} className="aim-checkrow">
                            <span className="ck"><i className="fa fa-check" /></span>
                            <div className="ct"><b>{d.n} {d.depOnly && <span className="up-tag dep"><i className="fa fa-user-plus" /> apenas para novos dependentes</span>}</b><div className="s">{d.s}</div></div>
                        </div>
                    ))}
                </div>}
                <div className="aim-uplabel" style={{ marginTop: 16 }}>Formulários para baixar e assinar</div>
                {b.downloads.map(d => (
                    <div key={d.n} className="aim-docrow">
                        <div className="dr-icon"><i className="fa fa-file-lines" /></div>
                        <div className="dr-body">
                            <div className="dr-name">{d.n} {d.depOnly && <span className="up-tag dep"><i className="fa fa-user-plus" /> novos dependentes</span>}</div>
                            <div className="dr-sub">{d.s}</div>
                        </div>
                        <button className="dr-dl" title="Baixar" onClick={() => { downloadDoc(d.n, b.name); toast({ kind: 'info', title: 'Download iniciado', message: d.n }); }}><i className="fa fa-download" /></button>
                    </div>
                ))}
                <div className="aim-foot">
                    <Button priority="default" onClick={backToMenu}>Cancelar</Button>
                    <Button priority="primary" rightIcon="fa-arrow-right" onClick={() => nextStep(b.id, m.tipo, null)}>Continuar</Button>
                </div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'upload') {
        const b = specOf(m.benefitId);
        const isHealth = !!FLOW[b.id];
        const hasNewDeps = (form.newDeps || []).length > 0;
        const reqDocs = b.required.filter(d => !d.depOnly || hasNewDeps);
        const dls = b.downloads.filter(d => (!d.depOnly || hasNewDeps) && (!/Portabilidade/i.test(d.n) || form.portab === 'sim'));
        const allItems = [...reqDocs, ...dls];
        const allDone = allItems.every(d => uploads[d.n]);
        const renderRow = (d, signed) => {
            const file = uploads[d.n];
            return (
                <div key={d.n} className="aim-uprow">
                    <div className="up-body">
                        <div className="up-name">{d.n} {signed && <span className="up-tag"><i className="fa fa-pen-nib" /> requer assinatura</span>}</div>
                        <div className={`up-file ${file ? '' : 'empty'}`}>
                            {file ? <><i className="fa fa-circle-check" /> {file}</> : (signed ? 'Anexe o formulário preenchido e assinado' : 'Nenhum arquivo anexado')}
                        </div>
                    </div>
                    <label className="btn btn-default btn-small" style={{ cursor: 'pointer' }}>
                        {file ? 'Trocar' : 'Selecionar arquivo'}
                        <input type="file" className="up-hidden" onChange={e => onUpload(d.n, e.target.files[0])} />
                    </label>
                </div>
            );
        };
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-paperclip" /> Anexar Documentos</div>
                <div style={{ fontSize: 13.5, color: 'var(--sds-fg-muted)', marginBottom: 14 }}>Anexe os formulários que você baixou, preencheu e assinou{reqDocs.length > 0 ? ', além dos documentos dos novos dependentes.' : '.'}</div>
                {reqDocs.length > 0 && <>
                    <div className="aim-uplabel">Documentos dos novos dependentes</div>
                    {reqDocs.map(d => renderRow(d, false))}
                </>}
                {reqDocs.length === 0 && isHealth && <div className="aim-note"><i className="fa fa-circle-check" /> Seus documentos e os dos dependentes já cadastrados constam no sistema — nada a anexar aqui.</div>}
                <div className="aim-uplabel" style={{ marginTop: 16 }}>Formulários preenchidos e assinados</div>
                {dls.map(d => renderRow(d, true))}
                <div className="aim-note" style={{ marginBottom: 0, marginTop: 14 }}><i className="fa fa-shield-halved" /> Seus documentos são enviados de forma segura e analisados pelo RH.</div>
                <div className="aim-foot">
                    <Button priority="default" onClick={backToMenu}>Cancelar</Button>
                    <Button priority="primary" rightIcon="fa-arrow-right" disabled={!allDone} onClick={() => add({ from: 'bot', kind: 'review', benefitId: b.id, tipo: m.tipo })}>Revisar e enviar</Button>
                </div>
                {!allDone && <div style={{ fontSize: 12, color: 'var(--sds-fg-subtle)', textAlign: 'right', marginTop: 6 }}>Anexe todos os documentos e formulários assinados para continuar.</div>}
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'review') {
        const b = specOf(m.benefitId);
        const isHealth = !!FLOW[b.id];
        const selDeps = (form.selectedDeps || []).map(id => DEPS.find(d => d.id === id)).filter(Boolean).map(d => ({ nome: d.nome, cpf: d.cpf, nasc: d.nasc, parentesco: d.rel }));
        const newDeps = (form.newDeps || []).map(d => ({ nome: d.nome || 'Não informado', cpf: d.cpf || 'Não informado', nasc: d.nasc || 'Não informado', parentesco: d.parentesco || 'Não informado' }));
        const deps = [...selDeps, ...newDeps];
        const files = Object.entries(uploads);
        const planoLabel = b.id === 'odonto' ? 'plano odontológico' : 'plano de saúde';
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-eye" /> Revisão &amp; Envio</div>

                <div className="rev-sec">
                    <div className="rev-head"><span className="rev-title"><i className="fa fa-location-dot" /> Endereço do colaborador</span>
                        <button className="rev-edit" onClick={() => goBack('titular')}><i className="fa fa-pen" /> Alterar</button></div>
                    <div className="aim-grid">
                        <div><div className="k">Nome</div><div className="v">Carlos Eduardo Lima</div></div>
                        <div><div className="k">Matrícula</div><div className="v">001234</div></div>
                    </div>
                </div>

                {isHealth && <div className="rev-sec">
                    <div className="rev-head"><span className="rev-title"><i className={`fa ${b.icon}`} /> Plano Selecionado</span>
                        <button className="rev-edit" onClick={() => goBack('planoConfig')}><i className="fa fa-pen" /> Alterar</button></div>
                    <div className="aim-grid">
                        <div><div className="k">Portabilidade</div><div className="v">{form.portab === 'sim' ? `Sim${form.operadoraAtual ? ' — ' + form.operadoraAtual : ''}` : 'Não'}</div></div>
                        <div><div className="k">Operadora</div><div className="v">{form.operadora || '—'}</div></div>
                        {b.id === 'odonto'
                            ? <div><div className="k">Plano</div><div className="v">{form.planoTipo || '—'}</div></div>
                            : <>
                                <div><div className="k">Abrangência</div><div className="v">{form.abrangencia || '—'}</div></div>
                                <div><div className="k">Acomodação</div><div className="v">{form.acomodacao || '—'}</div></div>
                            </>}
                    </div>
                </div>}

                {isHealth && <div className="rev-sec">
                    <div className="rev-head"><span className="rev-title"><i className="fa fa-users" /> Dependentes ({deps.length})</span>
                        <button className="rev-edit" onClick={() => goBack('dependentes')}><i className="fa fa-pen" /> Alterar</button></div>
                    {deps.length === 0
                        ? <div className="rev-empty">Nenhum dependente incluído</div>
                        : deps.map((d, i) => (
                            <div key={i} className="rev-dep">
                                <div className="rd-name">{i + 1}. {d.nome}</div>
                                <div className="rd-grid"><span><b>CPF:</b> {d.cpf}</span><span><b>Nasc:</b> {d.nasc}</span><span><b>Parentesco:</b> {d.parentesco}</span></div>
                            </div>
                        ))}
                </div>}

                <div className="rev-sec">
                    <div className="rev-head"><span className="rev-title"><i className="fa fa-file-lines" /> Anexos ({files.length})</span>
                        <button className="rev-edit" onClick={() => goBack('upload')}><i className="fa fa-pen" /> Alterar</button></div>
                    {files.length === 0
                        ? <div className="rev-empty">Nenhum anexo</div>
                        : <ul className="rev-files">{files.map(([doc, fn], i) => (
                            <li key={i}><i className="fa fa-paperclip" /> {fn} <span className="rf-doc">— {doc}</span></li>
                        ))}</ul>}
                </div>

                <label className="aim-confirm boxed">
                    <span className={`cb ${form.revConfirm ? 'checked' : ''}`} onClick={() => setForm(f => ({ ...f, revConfirm: !f.revConfirm }))}>{form.revConfirm && <i className="fa fa-check" />}</span>
                    <span>Declaro ciência da política de benefícios, prazos de carência e condições do {planoLabel}.</span>
                </label>

                <div className="aim-foot">
                    <Button priority="default" onClick={() => goBack('review')}>Voltar</Button>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button priority="default" onClick={() => toast({ kind: 'info', title: 'Rascunho salvo', message: 'Você pode retomar esta solicitação mais tarde.' })}>Salvar rascunho</Button>
                        <Button priority="primary" icon="fa-paper-plane" disabled={!form.revConfirm} onClick={() => submitRequest(b, m.tipo)}>Enviar para validação do RH</Button>
                    </div>
                </div>
                {!form.revConfirm && <div style={{ fontSize: 12, color: 'var(--sds-fg-subtle)', textAlign: 'right', marginTop: 6 }}>Marque a declaração de ciência para enviar.</div>}
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'success') return <>
        <div className="aim-bot">
            <div className="aim-success">
                <div className="sc-ic"><i className="fa fa-check" /></div>
                <h3>Solicitação enviada com sucesso!</h3>
                <p>Sua solicitação para <b>{m.benefitName}</b> foi registrada.</p>
                <div className="sc-proto">Protocolo {m.protocol}</div>
                <p>O RH analisará e você poderá acompanhar o andamento em "Acompanhamento de Chamados".</p>
            </div>
            <div className="aim-foot" style={{ justifyContent: 'center' }}>
                <Button priority="default" onClick={backToMenu}>Voltar ao menu</Button>
                <Button priority="primary" onClick={() => add({ from: 'bot', kind: 'tracking' })}>Acompanhar</Button>
            </div>
        </div>
        <Time />
    </>;

    if (m.kind === 'tracking') {
        const benefits = window.COLAB_BENEFITS || [];
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-list-check" /> Acompanhamento de benefícios</div>
                {benefits.map(b => (
                    <div key={b.id} className="aim-trackrow">
                        <div className={`tr-tile ${b.tile}`}><i className={`fa ${b.icon}`} /></div>
                        <div className="tr-body"><div className="tr-name">{b.title}</div><div className="tr-sub">{b.meta}</div></div>
                        <StatusPill color={b.statusColor}>{b.status}</StatusPill>
                    </div>
                ))}
                <div className="aim-foot"><Button priority="default" onClick={backToMenu}>Voltar ao menu</Button></div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'approvals') {
        const reqs = (window.RH_REQUESTS || []).filter(r => r.status === 'Pendente');
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-user-check" /> Solicitações pendentes</div>
                {reqs.map((r, i) => (
                    <div key={i} className="aim-uprow">
                        <div className="up-body">
                            <div className="up-name">{r.nome} — {r.acao}</div>
                            <div className="up-file empty">{r.setor} · {r.when}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <Button priority="primary" size="small" onClick={() => toast({ kind: 'succ', title: 'Aprovada', message: `${r.acao} — ${r.nome}` })}>Aprovar</Button>
                            <Button priority="default" size="small" onClick={() => toast({ kind: 'warn', title: 'Recusada', message: `${r.acao} — ${r.nome}` })}>Recusar</Button>
                        </div>
                    </div>
                ))}
                <div className="aim-foot"><Button priority="default" onClick={backToMenu}>Voltar ao menu</Button></div>
            </div>
            <Time />
        </>;
    }

    if (m.kind === 'policies') {
        const pols = window.RH_POLICIES || [];
        return <>
            <div className="aim-bot">
                <div className="aim-card-title"><i className="fa fa-sliders" /> Políticas de benefícios</div>
                {pols.map(p => (
                    <div key={p.id} className="aim-trackrow">
                        <div className={`tr-tile ${p.tile}`}><i className={`fa ${p.icon}`} /></div>
                        <div className="tr-body"><div className="tr-name">{p.title}</div><div className="tr-sub">{p.meta}</div></div>
                        <StatusPill color={p.statusColor}>{p.status}</StatusPill>
                    </div>
                ))}
                <div className="aim-foot"><Button priority="default" onClick={backToMenu}>Voltar ao menu</Button></div>
            </div>
            <Time />
        </>;
    }

    return null;
}

Object.assign(window, { AIAssistant });
