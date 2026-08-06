/* RH — Nova Política de Benefício: card de criação, modal de tipo e editor.
   Carregado antes de screens-benefits.jsx. Exporta para window. */

const { useState: useStateN } = React;

const NEW_POLICY_TYPES = [
    { id: 'vt',      name: 'Vale-Transporte',      icon: 'fa-bus',           tile: 'tile-blue' },
    { id: 'ps',      name: 'Plano de Saúde',       icon: 'fa-heart',         tile: 'tile-red' },
    { id: 'odonto',  name: 'Plano Odontológico',   icon: 'fa-tooth',         tile: 'tile-green' },
    { id: 'total',   name: 'TotalPass',            icon: 'fa-dumbbell',      tile: 'tile-orange' },
    { id: 'edu',     name: 'Auxílio Educação',     icon: 'fa-graduation-cap', tile: 'tile-purple' },
    { id: 'adiant',  name: 'Adiantamento Salarial', icon: 'fa-credit-card',  tile: 'tile-teal' },
    { id: 'outro',   name: 'Outro',                icon: 'fa-plus',          tile: 'tile-gray' },
];

const ACTION_TYPES = {
    'Alterar': { icon: 'fa-pen',   soft: 'soft-purple', desc: 'Altera uma regra ou condição da política existente.' },
    'Incluir': { icon: 'fa-plus',  soft: 'soft-green',  desc: 'Inclui uma nova regra ou condição à política.' },
    'Excluir': { icon: 'fa-trash', soft: 'soft-red',    desc: 'Remove uma regra ou condição da política.' },
};

const SEED_ACTIONS = [
    { type: 'Alterar', ativa: true, when: '22/05/2026 09:41', to: 120, obs: 'Alteração no valor mensal do benefício. Novo valor: R$ 150,00.', file: 'tabela-valores.pdf', size: '120 KB' },
    { type: 'Incluir', ativa: true, when: '20/05/2026 14:30', to: 118, obs: 'Inclusão de cobertura para exames laboratoriais.', file: 'cobertura-exames.pdf', size: '98 KB' },
    { type: 'Excluir', ativa: true, when: '18/05/2026 11:15', to: 115, obs: 'Exclusão da cobertura para procedimentos estéticos.', file: 'atualizacao-politica.pdf', size: '76 KB' },
];

const DIRETRIZES_DEMO = 'Esta política regulamenta a concessão do benefício aos colaboradores elegíveis, incluindo regras de carência, valores de referência, formas de reembolso e critérios de elegibilidade conforme a política interna de RH.';

function NewPolicyModal({ open, onClose, onPick }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Nova política de benefício"
            footer={<Button priority="default" onClick={onClose}>Cancelar</Button>}
        >
            <div className="pol-grouplabel">Selecione o tipo de benefício que deseja criar.</div>
            <div className="np-types">
                {NEW_POLICY_TYPES.map(t => (
                    <button className="np-type" key={t.id} onClick={() => onPick(t)}>
                        <span className={`np-type-ic ${t.tile}`}><i className={`fa ${t.icon}`} /></span>
                        <span className="np-type-name">{t.name}</span>
                        <i className="fa fa-chevron-right np-type-go" />
                    </button>
                ))}
            </div>
        </Modal>
    );
}

function ActionMenu({ onPick }) {
    const [open, setOpen] = useStateN(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (!open) return;
        const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);
    const pick = opt => { setOpen(false); onPick(opt); };
    return (
        <div className="np-menu" ref={ref}>
            <button className="np-menu-btn" onClick={() => setOpen(o => !o)}>Ações <i className="fa fa-chevron-down" /></button>
            {open && (
                <div className="np-menu-list">
                    {['Editar', 'Ativar', 'Desativar', 'Excluir'].map(o => (
                        <button key={o} className={`np-menu-item ${o === 'Excluir' ? 'danger' : ''}`} onClick={() => pick(o)}>{o}</button>
                    ))}
                </div>
            )}
        </div>
    );
}

function NPSection({ icon, tile, title, children }) {
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

function NewPolicyEditor({ type, onBack, onSaved }) {
    const toast = useToast();
    const [form, setForm] = useStateN({ nome: '', empresa: '', filial: '', versao: '', dataCriacao: '', dataVigencia: '', status: 'Inativa' });
    const [diretrizes, setDiretrizes] = useStateN('');
    const [actions, setActions] = useStateN(SEED_ACTIONS);
    const [newOpen, setNewOpen] = useStateN(false);
    const [na, setNa] = useStateN({ titulo: '', explic: '', obs: '', anexo: null });
    const setNaField = (k, v) => setNa(x => ({ ...x, [k]: v }));
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const extrair = () => {
        if (!diretrizes.trim()) { toast({ kind: 'warn', title: 'Preencha a política completa', message: 'Escreva ou cole o texto da política antes de extrair as regras.' }); return; }
        toast({ kind: 'succ', title: 'Regras extraídas', message: 'A IA identificou 4 regras a partir do texto da política.' });
    };

    const fecharNova = () => { setNewOpen(false); setNa({ titulo: '', explic: '', obs: '', anexo: null }); };
    const criarAcao = () => {
        if (!na.titulo.trim()) { toast({ kind: 'warn', title: 'Informe o título', message: 'O título da ação é obrigatório.' }); return; }
        setActions(a => [{
            type: na.titulo.trim(), ativa: true, when: '05/08/2026 14:20', to: 0,
            desc: na.explic.trim() || 'Sem explicação adicional.',
            obs: na.obs.trim() || 'Sem observação adicional.',
            file: na.anexo, size: '54 KB',
        }, ...a]);
        fecharNova();
        toast({ kind: 'succ', title: 'Ação criada', message: na.titulo.trim() });
    };

    const onActionMenu = (i, opt) => {
        if (opt === 'Excluir') { setActions(a => a.filter((_, j) => j !== i)); toast({ kind: 'warn', title: 'Ação excluída', message: 'A ação foi removida desta política.' }); return; }
        if (opt === 'Editar') { toast({ kind: 'info', title: 'Editar ação', message: 'Abrindo edição da ação selecionada.' }); return; }
        const ativa = opt === 'Ativar';
        setActions(a => a.map((x, j) => j === i ? { ...x, ativa } : x));
        toast({ kind: ativa ? 'succ' : 'warn', title: ativa ? 'Ação ativada' : 'Ação desativada', message: 'Status atualizado nesta política.' });
    };

    const salvar = () => {
        const nome = form.nome || `Política de ${type.name}`;
        onSaved({ id: 'np-' + Date.now(), tile: type.tile, icon: type.icon, title: nome, desc: form.empresa || 'Waapi Tecnologia LTDA', status: form.status, statusColor: form.status === 'Ativa' ? 'green' : 'orange' });
        toast({ kind: 'succ', title: 'Política salva', message: nome, duration: 6000 });
    };

    return (
        <div className="app-main-inner">
            <div className="bx-header bx-divider">
                <div className="td-back" onClick={onBack}><i className="fa fa-arrow-left" /> Voltar para Gestão de Benefícios</div>
                <Breadcrumb onHome={onBack} items={[
                    { label: 'Gestão de Benefícios', onClick: onBack },
                    { label: 'Nova política' },
                    { label: type.name },
                ]} />
            </div>

            <div className="bx-body" style={{ paddingTop: 4 }}>
                <div className="np-head">
                    <span className={`np-head-ic ${type.tile}`}><i className={`fa ${type.icon}`} /></span>
                    <div>
                        <h2>{type.name === 'Outro' ? 'Nova política personalizada' : type.name}</h2>
                        <div className="np-head-sub">Configuração de política de benefício</div>
                    </div>
                </div>

                <div className="pol-card">
                    <NPSection icon={type.icon} tile="soft-blue" title="Seção 1 — Identificação da política">
                        <div className="grid grid-2 gap-16">
                            <Field label="Nome da política" required>
                                <Textfield value={form.nome} onChange={v => set('nome', v)} placeholder={`Ex: Política de ${type.name} 2026`} />
                            </Field>
                            <Field label="Empresa" required>
                                <Textfield value={form.empresa} onChange={v => set('empresa', v)} placeholder="Ex: Waapi Tecnologia LTDA" />
                            </Field>
                            <Field label="Filial">
                                <Textfield value={form.filial} onChange={v => set('filial', v)} placeholder="Ex: Matriz São Paulo" />
                            </Field>
                            <Field label="Versão">
                                <Textfield value={form.versao} onChange={v => set('versao', v)} placeholder="Ex: 1.0" />
                            </Field>
                            <Field label="Data de criação">
                                <Textfield value={form.dataCriacao} onChange={v => set('dataCriacao', v)} placeholder="dd/mm/aaaa" />
                            </Field>
                            <Field label="Data de vigência">
                                <Textfield value={form.dataVigencia} onChange={v => set('dataVigencia', v)} placeholder="dd/mm/aaaa" />
                            </Field>
                            <Field label="Status">
                                <Select value={form.status} onChange={v => set('status', v)} options={[{ value: 'Inativa', label: 'Inativa' }, { value: 'Ativa', label: 'Ativa' }]} />
                            </Field>
                        </div>
                    </NPSection>

                    <NPSection icon="fa-file-lines" tile="soft-blue" title="Política e Regras">
                        <Field label="Descrição da política">
                            <Textarea value={diretrizes} onChange={setDiretrizes} rows={8}
                                placeholder={'A empresa oferece este benefício aos colaboradores elegíveis, conforme as condições definidas nesta política. A participação do colaborador seguirá o percentual estabelecido sobre o valor do benefício.\n\n[Detalhe aqui as condições de elegibilidade, prazos de carência, procedimentos para inclusão/exclusão e demais regras.]'} />
                        </Field>
                    </NPSection>

                    <NPSection icon="fa-list-check" tile="soft-purple" title="Ações da política">
                        <div className="np-actions-head">
                            <p>Crie e gerencie ações (alterar, incluir ou excluir) que serão comunicadas aos colaboradores.</p>
                            <Button priority="secondary" icon="fa-plus" onClick={() => (newOpen ? fecharNova() : setNewOpen(true))}>Nova ação</Button>
                        </div>

                        {newOpen && (
                            <div className="np-newaction">
                                <Field label="Título" required>
                                    <Textfield value={na.titulo} onChange={v => setNaField('titulo', v)} placeholder="Ex: Inclusão de nova cobertura" />
                                </Field>
                                <Field label="Explicação da ação" hint="Descreva o que essa ação faz na política.">
                                    <Textarea value={na.explic} onChange={v => setNaField('explic', v)} rows={3} placeholder="Ex: Adiciona uma nova regra ou condição à política, ampliando o que já está coberto." />
                                </Field>
                                <Field label="Observação">
                                    <Textarea value={na.obs} onChange={v => setNaField('obs', v)} rows={3} placeholder="Detalhes específicos comunicados ao colaborador." />
                                </Field>
                                <Field label="Anexo (opcional)">
                                    {na.anexo
                                        ? <div className="np-att" style={{ maxWidth: 320 }}><i className="fa fa-file-pdf" /><div><div>{na.anexo}</div><div className="np-att-size">54 KB</div></div><i className="fa fa-xmark np-att-dl" onClick={() => setNaField('anexo', null)} /></div>
                                        : <Button priority="default" icon="fa-paperclip" onClick={() => setNaField('anexo', 'documento-anexo.pdf')}>Anexar arquivo</Button>}
                                </Field>
                                <div className="rhc-actions">
                                    <Button priority="default" onClick={fecharNova}>Cancelar</Button>
                                    <Button priority="primary" disabled={!na.titulo.trim()} onClick={criarAcao}>Criar ação</Button>
                                </div>
                            </div>
                        )}

                        <div className="np-actions">
                            {actions.map((a, i) => {
                                const meta = ACTION_TYPES[a.type] || { icon: 'fa-clipboard-list', soft: 'soft-purple', desc: a.desc || '' };
                                return (
                                    <div className="np-action" key={i}>
                                        <div className="np-action-top">
                                            <span className={`pol-sec-ic ${meta.soft}`}><i className={`fa ${meta.icon}`} /></span>
                                            <div className="np-action-id">
                                                <div className="np-action-title">{a.type}</div>
                                                <div className="np-action-desc">{a.desc || meta.desc}</div>
                                            </div>
                                            <span className={`rhc-chip ${a.ativa ? 'green' : 'orange'}`}>{a.ativa ? 'Ativa' : 'Inativa'}</span>
                                            <div className="np-action-meta">
                                                <span>Enviada em {a.when}</span>
                                                <span>Enviada para {a.to} colaboradores</span>
                                            </div>
                                            <ActionMenu onPick={opt => onActionMenu(i, opt)} />
                                        </div>
                                        <div className="np-action-grid">
                                            <div>
                                                <div className="np-action-lbl">Observação</div>
                                                <div className="np-action-obs">{a.obs}</div>
                                            </div>
                                            <div>
                                                <div className="np-action-lbl">Anexo</div>
                                                {a.file
                                                    ? <div className="np-att"><i className="fa fa-file-pdf" /><div><div>{a.file}</div><div className="np-att-size">{a.size}</div></div><i className="fa fa-download np-att-dl" /></div>
                                                    : <div className="np-action-obs" style={{ color: 'var(--sds-fg-subtle)' }}>Nenhum anexo</div>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </NPSection>
                </div>

                <div className="pol-actions">
                    <Button priority="default" onClick={onBack}>Cancelar</Button>
                    <div className="pol-actions-right">
                        <Button priority="primary" icon="fa-floppy-disk" onClick={salvar}>Salvar política</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

Object.assign(window, { NEW_POLICY_TYPES, NewPolicyModal, NewPolicyEditor });
