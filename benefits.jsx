/* Autoatendimento de Benefícios — shared pieces, data, navbar & flyout
   Loaded after components.jsx. Exports to window. */

const { useState, useEffect, useRef } = React;

/* ─── Breadcrumb ─── */
function Breadcrumb({ items, onHome }) {
    return (
        <div className="breadcrumb">
            <span className="crumb-home" onClick={onHome}><i className="fa fa-home" /></span>
            {items.map((it, i) => (
                <React.Fragment key={i}>
                    <span className="sep"><i className="fa fa-chevron-right" /></span>
                    {it.onClick
                        ? <a onClick={it.onClick}>{it.label}</a>
                        : <span className="current">{it.label}</span>}
                </React.Fragment>
            ))}
        </div>
    );
}

/* ─── Status pill (dot + label) ─── */
function StatusPill({ color = 'green', children }) {
    return (
        <span className={`status-pill ${color}`}>
            <span className="dot" />
            {children}
        </span>
    );
}

/* ─── KPI tile ─── */
function Kpi({ icon, soft = 'soft-blue', label, value }) {
    return (
        <div className="kpi">
            <div className={`kpi-icon ${soft}`}><i className={`fa ${icon}`} /></div>
            <div className="kpi-body">
                <span className="kpi-label">{label}</span>
                <span className="kpi-value">{value}</span>
            </div>
        </div>
    );
}

/* ─── Benefit / policy card ─── */
function BenefitCard({ tile, icon, title, desc, status, statusColor, meta, link, onClick }) {
    return (
        <div className={`bcard ${onClick ? 'clickable' : ''}`} onClick={onClick}>
            <div className="bcard-top">
                <div className={`bcard-tile ${tile}`}><i className={`fa ${icon}`} /></div>
                <StatusPill color={statusColor}>{status}</StatusPill>
            </div>
            <h3>{title}</h3>
            <div className="bcard-desc">{desc}</div>
            <div className="bcard-foot">
                <div className="bcard-meta">{meta}</div>
                {link && <span className="bcard-link">{link} <i className="fa fa-arrow-right" /></span>}
            </div>
        </div>
    );
}

/* ─── Role-selection flyout ─── */
function RoleFlyout({ open, onClose, onSelect }) {
    useEffect(() => {
        if (!open) return;
        const onKey = e => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);
    if (!open) return null;
    return (
        <>
            <div className="role-flyout-backdrop" onClick={onClose} />
            <div className="role-flyout" role="menu">
                <div className="rf-header">
                    <div>
                        <h2>Gestão de Benefícios</h2>
                        <div className="rf-sub">Selecione a visualização</div>
                    </div>
                    <span className="rf-close" onClick={onClose}><i className="fa fa-times" /></span>
                </div>
                <div className="rf-options">
                    <button className="role-option" onClick={() => onSelect('analista')}>
                        <span className="ro-icon"><i className="fa fa-users-cog" /></span>
                        <span className="ro-body">
                            <span className="ro-title">Analista de RH</span>
                            <span className="ro-desc">Gerencie políticas, beneficiários e aprovações</span>
                        </span>
                        <i className="fa fa-chevron-right ro-arrow" />
                    </button>
                    <button className="role-option" onClick={() => onSelect('colaborador')}>
                        <span className="ro-icon"><i className="fa fa-id-card" /></span>
                        <span className="ro-body">
                            <span className="ro-title">Colaborador</span>
                            <span className="ro-desc">Solicite, adira e acompanhe seus benefícios</span>
                        </span>
                        <i className="fa fa-chevron-right ro-arrow" />
                    </button>
                </div>
                <div className="rf-foot">Sua visualização atual segue suas permissões de acesso.</div>
            </div>
        </>
    );
}

/* ─── Notifications data ─── */
const NOTIFICATIONS = [
    { id: 'n1', unread: true,  icon: 'fa-comment-dots', title: 'O RH entrou em contato', sub: 'Olá, Carlos',
      preview: 'Mariana Costa enviou uma mensagem sobre seu chamado de inclusão de dependente.',
      body: 'Mariana Costa (Analista de RH) enviou uma mensagem sobre o seu chamado de inclusão de dependente no Plano de Saúde. É necessário reenviar a certidão de nascimento da Ana Clara em melhor qualidade.',
      origem: 'Gestão de Benefícios', tipo: 'Mensagem', data: '29/05/2026 às 09:14', ticket: '#4790' },
    { id: 'n2', unread: true,  icon: 'fa-clock', title: 'Chamado em análise', sub: 'Plano Odontológico',
      preview: 'Sua adesão ao Plano Odontológico (protocolo #4821) está em análise pelo RH.',
      body: 'Sua solicitação de adesão ao Plano Odontológico, protocolo #4821, foi recebida e está em análise pela equipe de RH. Você será avisado assim que houver retorno.',
      origem: 'Gestão de Benefícios', tipo: 'Andamento', data: '26/05/2026 às 15:30', ticket: '#4821' },
    { id: 'n3', unread: false, icon: 'fa-circle-check', title: 'Solicitação concluída', sub: 'Vale-Transporte',
      preview: 'Sua atualização de rota do Vale-Transporte (protocolo #4733) foi concluída.',
      body: 'A atualização de rota do seu Vale-Transporte, protocolo #4733, foi processada e concluída com sucesso. O novo valor já está disponível no seu benefício.',
      origem: 'Gestão de Benefícios', tipo: 'Conclusão', data: '14/05/2026 às 11:02', ticket: '#4733' },
    { id: 'n4', unread: false, icon: 'fa-triangle-exclamation', title: 'Documentos pendentes', sub: 'Auxílio Creche',
      preview: 'O chamado de Auxílio Creche (protocolo #4688) aguarda o envio de documentos.',
      body: 'O seu chamado de Auxílio Creche, protocolo #4688, está pendente. É necessário anexar os documentos solicitados para dar andamento à análise.',
      origem: 'Gestão de Benefícios', tipo: 'Pendência', data: '09/05/2026 às 08:20', ticket: '#4688' },
];

/* ─── Notification preview flyout (off the navbar bell) ─── */
function NotificationFlyout({ open, onClose, notifs, onOpenNotif, onSeeAll }) {
    useEffect(() => {
        if (!open) return;
        const onKey = e => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);
    if (!open) return null;

    const unread = notifs.filter(n => n.unread).length;

    return (
        <>
            <div className="role-flyout-backdrop" onClick={onClose} />
            <div className="notif-flyout" role="menu">
                <div className="nf-header">
                    <span className="nf-back" onClick={onClose}><i className="fa fa-chevron-left" /></span>
                    <h2>Notificações</h2>
                    {unread > 0 && <span className="nf-count">{unread} não lida{unread > 1 ? 's' : ''}</span>}
                </div>
                <div className="nf-list">
                    {notifs.map(n => (
                        <button key={n.id} className={`nf-item ${n.unread ? 'unread' : ''}`}
                                onClick={() => onOpenNotif(n)}>
                            <span className="nf-ic"><i className={`fa ${n.icon}`} /></span>
                            <span className="nf-body">
                                <span className="nf-title">{n.title}{n.unread && <span className="nf-dot" />}</span>
                                <span className="nf-preview">{n.preview}</span>
                                <span className="nf-time">{n.data}</span>
                            </span>
                        </button>
                    ))}
                </div>
                <div className="nf-foot">
                    <button className="nf-seeall" onClick={onSeeAll}>Visualizar todas as notificações</button>
                </div>
            </div>
        </>
    );
}

/* ─── Side tooltip for the left rail (fixed, escapes rail clipping) ─── */
function SideTooltip({ text, children }) {
    const [pos, setPos] = useState(null);
    const ref = useRef(null);
    const show = () => { const r = ref.current.getBoundingClientRect(); setPos({ top: r.top + r.height / 2, left: r.right + 10 }); };
    return (
        <span className="nav-tt-wrap" ref={ref} onMouseEnter={show} onMouseLeave={() => setPos(null)}>
            {children}
            {pos && <span className="nav-tt" style={{ top: pos.top, left: pos.left }}>{text}</span>}
        </span>
    );
}

/* ─── Navbar (left rail) with the Benefícios card trigger ─── */
function BenefitsNavbar({ active, flyoutOpen, onToggleFlyout, onHome, notifOpen, onToggleNotif, unreadCount }) {
    const items = [
        { id: 'tags',       icon: 'fa-tag' },
        { id: 'pacotes',    icon: 'fa-box' },
        { id: 'metas',      icon: 'fa-bullseye' },
        { id: 'monitor',    icon: 'fa-desktop' },
        { id: 'tabelas',    icon: 'fa-th' },
        { id: 'arquivos',   icon: 'fa-folder' },
    ];
    return (
        <nav className="sds-navbar">
            <div className="nav-header">
                <div className="nav-brand"><span className="nav-favicon"><SeniorGlyph size={32} /></span></div>
                <div className="nav-avatar"><span className="avatar" style={{ margin: 0 }}>JM</span></div>
            </div>
            <div className="nav-items">
                <SideTooltip text="Gestão de Benefícios">
                    <div className={`nav-item ${flyoutOpen || active === 'colaborador' || active === 'analista' ? 'boxed' : ''}`}
                         onClick={onToggleFlyout}>
                        <i className="fa fa-id-card" />
                    </div>
                </SideTooltip>
            </div>
            <div className="nav-footer">
                <div className="nav-item nav-more"><i className="fa fa-ellipsis-h" /></div>
                <div className="nav-sara" />
            </div>
        </nav>
    );
}

/* ─── Data ─── */
const COLAB_BENEFITS = [
    { id: 'vt',   tile: 'tile-blue',   icon: 'fa-bus',          title: 'Vale-Transporte',     desc: 'Benefício para deslocamento residência/trabalho.', status: 'Disponível', statusColor: 'blue',  meta: 'Desconto de 6% do salário', link: 'Solicitar' },
    { id: 'ps',   tile: 'tile-red',    icon: 'fa-heart',        title: 'Plano de Saúde',       desc: 'Cobertura médica e hospitalar nacional.',          status: 'Ativo',      statusColor: 'green',  meta: 'Individual ou familiar',    link: 'Gerenciar' },
    { id: 'po',   tile: 'tile-green',  icon: 'fa-tooth',        title: 'Plano Odontológico',   desc: 'Cobertura para tratamentos dentários.',            status: 'Disponível', statusColor: 'blue',   meta: 'Consultas, limpezas e canais', link: 'Solicitar' },
];

const COLAB_TICKETS = [
    { id: '#4821', icon: 'fa-tooth',   soft: 'soft-green',  title: 'Adesão — Plano Odontológico', meta: 'Aberto em 26/05/2026 · Protocolo #4821', status: 'Em análise',  color: 'yellow',
      detail: { tile: 'tile-green', fields: [['Operadora', 'Uniodonto'], ['Plano', 'Completo'], ['Dependentes', 'Não']], deps: [], docs: ['termo_adesao_odonto.pdf'] } },
    { id: '#4790', icon: 'fa-heart',   soft: 'soft-red',    title: 'Inclusão de dependente — Plano de Saúde', meta: 'Aberto em 22/05/2026 · Protocolo #4790', status: 'Em análise',  color: 'yellow', unread: true,
      detail: { tile: 'tile-red',
        fields: [['Operadora', 'Bradesco Saúde'], ['Portabilidade', 'Não'], ['Abrangência', 'Regional'], ['Acomodação', 'Apartamento']],
        deps: [
            { nome: 'Ana Clara Lima', cpf: '456.789.123-45', nasc: '29/11/2018', rel: 'Filho(a)' },
            { nome: 'Pedro Henrique Lima', cpf: '123.456.789-00', nasc: '03/07/2021', rel: 'Filho(a)' },
        ],
        docs: ['certidao_nascimento_ana.pdf', 'certidao_nascimento_pedro.pdf'],
        thread: [
            { autor: 'Mariana Costa', papel: 'rh', when: '21/05/2026 14:32', texto: 'Olá, Carlos! Recebemos sua solicitação de inclusão dos dependentes. A certidão da Ana Clara está com a digitalização um pouco ilegível na parte inferior. Poderia reenviar uma cópia mais nítida para darmos andamento? Obrigada!', anexos: [] },
        ] } },
    { id: '#4733', icon: 'fa-bus',     soft: 'soft-blue',   title: 'Atualização de rota — Vale-Transporte', meta: 'Aberto em 14/05/2026 · Protocolo #4733', status: 'Concluído', color: 'green',
      detail: { tile: 'tile-blue', fields: [['Tipo de solicitação', 'Inclusão'], ['Linha de Transporte', 'BLUMOB'], ['Valor do Passe (Ida e Volta)', 'R$ 9,40']], deps: [], docs: [] } },
    { id: '#4688', icon: 'fa-baby',    soft: 'soft-orange', title: 'Auxílio Creche — envio de documentos', meta: 'Aberto em 09/05/2026 · Protocolo #4688', status: 'Pendente',  color: 'orange',
      detail: { tile: 'tile-teal', fields: [['Benefício', 'Auxílio Creche'], ['Nome da criança', 'Sophia Almeida'], ['Data de nascimento', '12/03/2024'], ['Instituição', 'Creche Mundo Feliz'], ['Valor mensal', 'R$ 980,00']], deps: [], docs: ['certidao_nascimento.pdf', 'comprovante_matricula.pdf'] } },
];

const RH_POLICIES = [
    { id: 'vt', tile: 'tile-blue',  icon: 'fa-bus',   title: 'Vale-Transporte',   desc: 'Gerencie políticas de vale-transporte e benefícios de deslocamento.', status: 'Ativa',   statusColor: 'green', meta: '187 beneficiários', link: 'Configurar política' },
    { id: 'ps', tile: 'tile-red',   icon: 'fa-heart', title: 'Plano de Saúde',     desc: 'Configure regras e condições para planos de saúde corporativos.',     status: 'Ativa',   statusColor: 'green', meta: '263 beneficiários', link: 'Configurar política' },
    { id: 'po', tile: 'tile-green', icon: 'fa-tooth', title: 'Plano Odontológico', desc: 'Defina políticas de plano odontológico para colaboradores e dependentes.', status: 'Inativa', statusColor: 'gray',  meta: '0 beneficiários',   link: 'Ativar política' },
];

const RH_REQUESTS = [
    { who: 'BR', nome: 'Bruno Rocha',      acao: 'Adesão ao Plano Odontológico',           setor: 'Tecnologia', when: 'há 2h',    status: 'Pendente', color: 'orange' },
    { who: 'EP', nome: 'Eduarda Pinheiro', acao: 'Inclusão de dependente — Plano de Saúde', setor: 'Tecnologia', when: 'há 5h',    status: 'Pendente', color: 'orange' },
    { who: 'GT', nome: 'Gabriela Tavares', acao: 'Adesão ao Vale-Refeição',                 setor: 'Financeiro', when: 'ontem',    status: 'Pendente', color: 'orange' },
    { who: 'CM', nome: 'Carla Mendes',     acao: 'Cancelamento de Vale-Transporte',         setor: 'Financeiro', when: '2 dias',   status: 'Aprovado', color: 'green' },
    { who: 'FL', nome: 'Fernando Lobo',    acao: 'Atualização cadastral — Seguro de Vida',  setor: 'Comercial',  when: '3 dias',   status: 'Aprovado', color: 'green' },
];

const RH_COLLABORATORS = [
    { nome: 'Ana Silva Santos',      matricula: '001234', codigo: '05012', titulo: 'Alteração de valor da tarifa do Vale-Transporte', prioridade: 'Alta', solStatus: 'Aguardando resposta do colaborador', filial: 'São Paulo - SP',      empresa: 'Matriz Corporativa', cargo: 'Analista Financeiro', cpf: '123.456.789-01', beneficio: 'Vale-Transporte',    bIcon: 'fa-bus',   bTile: 'tile-blue',  tipo: 'Alteração', rh: 'Maria Santos',  when: '28/05/2026',
      detail: { tile: 'tile-blue', fields: [['Tipo de solicitação', 'Alteração'], ['Linha de Transporte', 'SP Trans'], ['Valor do Passe (Ida e Volta)', 'R$ 9,20'], ['Alteração solicitada', 'Atualização de valor da tarifa']], deps: [], docs: ['comprovante_tarifa.pdf'], escala: { agrupador: '0001 - Região Sul', agrupadorOpts: ['0001 - Região Sul', '0002 - Região Norte'], escala: '0001 - Escala Municipal', escalaOpts: ['0001 - Escala Municipal', '0002 - Escala Intermunicipal'] }, status: 'Em análise', color: 'yellow', protocolo: '#5012', aberto: '28/05/2026',
        thread: [
            { autor: 'Maria Santos', papel: 'rh', when: '28/05/2026 09:14', texto: 'Olá, Ana! Recebemos sua solicitação de alteração do valor da tarifa do Vale-Transporte. O comprovante enviado está com a data ilegível. Poderia confirmar a partir de qual data passou a valer a nova tarifa de R$ 9,20?', anexos: [] },
            { autor: 'Ana Silva Santos', papel: 'colaborador', when: '28/05/2026 10:02', texto: 'Oi, Maria! Claro. A nova tarifa passou a valer em 02/05/2026. Reenviei o comprovante atualizado com a data legível, pode conferir?', anexos: ['comprovante_tarifa_atualizado.pdf'] },
        ] } },
    { nome: 'Carlos Eduardo Lima',   matricula: '001235', codigo: '05009', titulo: 'Incluir dependente no meu plano de saúde', prioridade: 'Média', solStatus: 'Em andamento', filial: 'Rio de Janeiro - RJ', empresa: 'Filial Sul',         cargo: 'Gerente de Vendas',   cpf: '234.567.898-12', beneficio: 'Plano de Saúde',     bIcon: 'fa-heart', bTile: 'tile-red',   tipo: 'Inclusão',  rh: 'João Oliveira', when: '27/05/2026',
      detail: { tile: 'tile-red', fields: [['Tipo de solicitação', 'Inclusão de dependentes'], ['Benefício', 'Plano de Saúde'], ['Dependentes a incluir', '3']],
        plano: [['Seguradora', '00000005'], ['Nome da seguradora', 'Unimed de Blumenau'], ['Plano', '101'], ['Descrição do plano', 'Unimed BNU 5088 Vale Apto'], ['Matrícula', '001235'], ['Cód. plano Unimed', '026-5088-002293-00'], ['Portabilidade', 'Sim'], ['Operadora atual', 'Unimed'], ['Abrangência', 'Estadual'], ['Acomodação', 'Apartamento']],
        depsTable: [
            { nome: 'Maria Silva Santos', cpf: '987.654.321-00', nasc: '15/05/1990', rel: 'Cônjuge', ok: true },
            { nome: 'João Silva Santos', cpf: '456.789.123-00', nasc: '20/08/2015', rel: 'Filho(a)', ok: true },
        ],
        datas: [['Data de inclusão', '01/06/2026'], ['Mês de inclusão (mesinc)', '06/2026']],
        deps: [], docs: ['certidao_casamento.pdf', 'rg_beatriz.pdf'], status: 'Em análise', color: 'yellow', protocolo: '#5009', aberto: '27/05/2026' } },
    { nome: 'Roberta Alves Nunes',   matricula: '001240', codigo: '05014', titulo: 'Exclusão do Plano de Saúde', prioridade: 'Média', solStatus: 'Em andamento', filial: 'Blumenau - SC', empresa: 'Filial Sul', cargo: 'Analista de Suprimentos', cpf: '456.789.012-34', beneficio: 'Plano de Saúde', bIcon: 'fa-heart', bTile: 'tile-red', tipo: 'Exclusão', rh: 'João Oliveira', when: '27/05/2026',
      detail: { tile: 'tile-red', fields: [['Tipo de solicitação', 'Exclusão'], ['Benefício', 'Plano de Saúde'], ['Motivo da exclusão', 'Contratou plano por conta própria']],
        plano: [['Seguradora', '00000005'], ['Nome da seguradora', 'Unimed de Blumenau'], ['Plano', '101'], ['Descrição do plano', 'Unimed BNU 5088 Vale Apto'], ['Matrícula', '001240'], ['Cód. plano Unimed', '026-5088-002310-00']],
        datas: [['Data de exclusão', '31/07/2026'], ['Desconto no mês', 'Sim'], ['Mês de exclusão (mesexc)', '07/2026'], ['Motivo da exclusão', 'Não utiliza']],
        deps: [], docs: [], status: 'Pendente', color: 'orange', protocolo: '#5014', aberto: '27/05/2026' } },
];

Object.assign(window, {
    Breadcrumb, StatusPill, Kpi, BenefitCard, RoleFlyout, NotificationFlyout, BenefitsNavbar,
    COLAB_BENEFITS, COLAB_TICKETS, RH_POLICIES, RH_REQUESTS, RH_COLLABORATORS, NOTIFICATIONS
});
