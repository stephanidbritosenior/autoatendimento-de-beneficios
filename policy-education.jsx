/* RH — Política de Auxílio Educação: informações gerais + Modalidades.
   Reutiliza os padrões dos demais editores de política (pol-card / pol-section /
   np-action / np-menu / pol-adddoc / Modal / Toast). Carregado antes de screens-benefits.jsx. */

const { useState: useStateEdu } = React;

const EDU_EMPRESAS = [
    { value: 'matriz', label: 'Matriz Corporativa' }, { value: 'sul', label: 'Filial Sul' },
    { value: 'sudeste', label: 'Filial Sudeste' }, { value: 'nordeste', label: 'Filial Nordeste' },
];
const EDU_FILIAIS = [
    { value: 'sp', label: 'São Paulo - SP' }, { value: 'bnu', label: 'Blumenau - SC' },
    { value: 'rj', label: 'Rio de Janeiro - RJ' }, { value: 'todas', label: 'Todas as filiais' },
];
const EDU_TEMPO_OPTS = [
    { value: 'imediato', label: 'Imediato' }, { value: '30', label: '30 dias' },
    { value: '60', label: '60 dias' }, { value: '90', label: '90 dias' },
    { value: '180', label: '6 meses' }, { value: '365', label: '12 meses' },
];
const EDU_STATUS_OPTS = [{ value: 'Ativa', label: 'Ativa' }, { value: 'Inativa', label: 'Inativa' }];
const EDU_BASE_OPTS = [
    { value: 'definir', label: 'A definir' },
    { value: 'total', label: 'Valor total do curso' },
    { value: 'mensalidade', label: 'Valor de cada mensalidade' },
];
const EDU_TETO_OPTS = [
    { value: 'definir', label: 'A definir' },
    { value: 'solicitacao', label: 'Por solicitação' },
    { value: 'mensalidade', label: 'Por mensalidade' },
    { value: 'periodo', label: 'Por período' },
];

const EDU_SEED_MODALIDADES = [
    {
        nome: 'Idiomas', status: 'Ativa', subsidio: 'Sim', aprovacaoGestor: 'Sim',
        condicoes: 'Encaminhar comprovante de matrícula e contrato de pagamento da escola de idiomas.',
        documentos: ['Comprovante de matrícula', 'Contrato de pagamento'],
        tipoSubsidio: 'Percentual', percentual: '50', valorFixo: '', base: 'definir',
        temTeto: true, teto: '400,00', tetoPeriodo: 'definir',
    },
    {
        nome: 'Graduação', status: 'Ativa', subsidio: 'Sim', aprovacaoGestor: 'Sim',
        condicoes: 'Curso reconhecido pelo MEC e aderente à área de atuação do colaborador.',
        documentos: ['Comprovante de matrícula', 'Boleto da mensalidade'],
        tipoSubsidio: 'Percentual', percentual: '30', valorFixo: '', base: 'definir',
        temTeto: false, teto: '', tetoPeriodo: 'definir',
    },
];

const EDU_EMPTY_MOD = {
    nome: '', status: 'Ativa', subsidio: 'Não', aprovacaoGestor: 'Não',
    condicoes: '', documentos: [],
    tipoSubsidio: 'Percentual', percentual: '', valorFixo: '', base: 'definir',
    temTeto: false, teto: '', tetoPeriodo: 'definir',
};

function EduSection({ icon, tile, title, children }) {
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

function EduRowMenu({ onPick }) {
    const [open, setOpen] = useStateEdu(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (!open) return;
        const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);
    return (
        <div className="np-menu" ref={ref}>
            <button className="np-menu-btn" onClick={() => setOpen(o => !o)}>Ações <i className="fa fa-chevron-down" /></button>
            {open && (
                <div className="np-menu-list">
                    {['Editar', 'Ativar', 'Desativar', 'Excluir'].map(o => (
                        <button key={o} className={`np-menu-item ${o === 'Excluir' ? 'danger' : ''}`} onClick={() => { setOpen(false); onPick(o); }}>{o}</button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* Modal de criação/edição de modalidade */
function EduModalidadeModal({ open, value, onClose, onSave }) {
    const [m, setM] = useStateEdu(value || EDU_EMPTY_MOD);
    const [novoDoc, setNovoDoc] = useStateEdu('');
    React.useEffect(() => { if (open) { setM(value || EDU_EMPTY_MOD); setNovoDoc(''); } }, [open, value]);
    const set = (k, v) => setM(x => ({ ...x, [k]: v }));
    const addDoc = () => { if (!novoDoc.trim()) return; set('documentos', [...(m.documentos || []), novoDoc.trim()]); setNovoDoc(''); };

    return (
        <Modal
            open={open}
            onClose={onClose}
            width={760}
            title={value ? 'Editar modalidade' : 'Nova modalidade'}
            footer={
                <>
                    <Button priority="default" onClick={onClose}>Cancelar</Button>
                    <Button priority="primary" disabled={!m.nome.trim()} onClick={() => onSave(m)}>Salvar modalidade</Button>
                </>
            }
        >
            <div className="grid grid-2 gap-16">
                <Field label="Nome da modalidade" required>
                    <Textfield value={m.nome} onChange={v => set('nome', v)} placeholder="Ex: Idiomas" />
                </Field>
                <Field label="Status da modalidade">
                    <Select value={m.status} onChange={v => set('status', v)} options={EDU_STATUS_OPTS} />
                </Field>
            </div>

            <div className="grid grid-2 gap-16" style={{ marginTop: 4 }}>
                <Field label="Subsídio financeiro">
                    <div className="pol-checks cols-2">
                        {['Sim', 'Não'].map(o => <Radio key={o} name="edu-subsidio" checked={m.subsidio === o} onChange={() => set('subsidio', o)}>{o}</Radio>)}
                    </div>
                </Field>
                <Field label="Aprovação do gestor">
                    <div className="pol-checks cols-2">
                        {['Sim', 'Não'].map(o => <Radio key={o} name="edu-aprov" checked={m.aprovacaoGestor === o} onChange={() => set('aprovacaoGestor', o)}>{o}</Radio>)}
                    </div>
                </Field>
            </div>

            <Field label="Condições e orientações ao colaborador" hint="Texto exibido ao colaborador ao solicitar esta modalidade.">
                <Textarea value={m.condicoes} onChange={v => set('condicoes', v)} rows={4}
                    placeholder="Ex: Encaminhar comprovante de matrícula e contrato de pagamento." />
            </Field>

            <Field label="Documentos necessários">
                {(m.documentos || []).length > 0 && (
                    <div className="pol-docs">
                        {m.documentos.map((d, i) => (
                            <div className="pol-doc" key={i}>
                                <i className="fa fa-file-lines" style={{ color: 'var(--sds-fg-muted)' }} />
                                <span style={{ fontSize: 15 }}>{d}</span>
                                <i className="fa fa-xmark pol-doc-x" onClick={() => set('documentos', m.documentos.filter((_, j) => j !== i))} />
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <Textfield value={novoDoc} onChange={setNovoDoc} placeholder="Ex: Comprovante de matrícula" />
                    </div>
                    <Button priority="default" icon="fa-plus" disabled={!novoDoc.trim()} onClick={addDoc}>Adicionar</Button>
                </div>
            </Field>

            {m.subsidio === 'Sim' && (
                <div className="np-newaction" style={{ marginTop: 20, marginBottom: 0 }}>
                    <div className="np-action-lbl" style={{ marginBottom: 14 }}>Regra financeira da modalidade</div>
                    <Field label="Tipo de subsídio">
                        <div className="pol-checks cols-2">
                            {['Percentual', 'Valor fixo'].map(o => <Radio key={o} name="edu-tiposub" checked={m.tipoSubsidio === o} onChange={() => set('tipoSubsidio', o)}>{o}</Radio>)}
                        </div>
                    </Field>
                    <div className="grid grid-2 gap-16">
                        {m.tipoSubsidio === 'Percentual' ? (
                            <>
                                <Field label="Percentual subsidiado (%)">
                                    <Textfield type="number" value={m.percentual} onChange={v => set('percentual', v)} placeholder="50" suffix={<i className="fa fa-percent" />} />
                                </Field>
                                <Field label="Base de aplicação" hint="Regra de negócio em definição — ajustável.">
                                    <Select value={m.base} onChange={v => set('base', v)} options={EDU_BASE_OPTS} />
                                </Field>
                            </>
                        ) : (
                            <Field label="Valor fixo subsidiado (R$)">
                                <Textfield value={m.valorFixo} onChange={v => set('valorFixo', v)} placeholder="0,00" prefix={<span style={{ fontSize: 14 }}>R$</span>} />
                            </Field>
                        )}
                    </div>
                    <Field label="Limite / teto">
                        <Switch on={m.temTeto} onChange={v => set('temTeto', v)}>Definir limite/teto para esta modalidade</Switch>
                    </Field>
                    {m.temTeto && (
                        <div className="grid grid-2 gap-16">
                            <Field label="Valor do teto (R$)">
                                <Textfield value={m.teto} onChange={v => set('teto', v)} placeholder="0,00" prefix={<span style={{ fontSize: 14 }}>R$</span>} />
                            </Field>
                            <Field label="Aplicação do teto" hint="Periodicidade ainda não definida pelo RH.">
                                <Select value={m.tetoPeriodo} onChange={v => set('tetoPeriodo', v)} options={EDU_TETO_OPTS} />
                            </Field>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
}

function eduSubsidioResumo(m) {
    if (m.subsidio !== 'Sim') return 'Sem subsídio financeiro';
    const base = (EDU_BASE_OPTS.find(o => o.value === m.base) || {}).label;
    const parte = m.tipoSubsidio === 'Percentual'
        ? `${m.percentual || '—'}% ${base && m.base !== 'definir' ? `sobre ${base.toLowerCase()}` : '(base a definir)'}`
        : `R$ ${m.valorFixo || '—'} (valor fixo)`;
    const teto = m.temTeto ? ` · teto de R$ ${m.teto || '—'}` : '';
    return parte + teto;
}

function EducationPolicyEditor({ policy, type, onBack, onSaved }) {
    const toast = useToast();
    const isNew = !policy;
    const meta = type || { name: 'Auxílio Educação', icon: 'fa-graduation-cap', tile: 'tile-purple' };
    const [form, setForm] = useStateEdu({
        nome: isNew ? '' : (policy.title || 'Auxílio Educação'),
        empresa: isNew ? '' : 'matriz',
        filial: isNew ? '' : 'todas',
        dataVigencia: '',
        tempoContrato: isNew ? '' : '90',
        status: isNew ? 'Inativa' : (policy.status || 'Ativa'),
        observacoes: '',
    });
    const [mods, setMods] = useStateEdu(isNew ? [] : ((policy && policy.modalidades) || EDU_SEED_MODALIDADES));
    const [modalOpen, setModalOpen] = useStateEdu(false);
    const [editIdx, setEditIdx] = useStateEdu(null);
    const [docs, setDocs] = useStateEdu(isNew ? [] : ['Regulamento do Auxílio Educação', 'FAQ Auxílio Educação']);
    const [addDocOpen, setAddDocOpen] = useStateEdu(false);
    const [newDoc, setNewDoc] = useStateEdu('');
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const abrirNova = () => { setEditIdx(null); setModalOpen(true); };
    const abrirEdicao = i => { setEditIdx(i); setModalOpen(true); };

    const salvarModalidade = m => {
        if (editIdx === null) {
            setMods(list => [...list, m]);
            toast({ kind: 'succ', title: 'Modalidade criada', message: m.nome });
        } else {
            setMods(list => list.map((x, j) => (j === editIdx ? m : x)));
            toast({ kind: 'succ', title: 'Modalidade atualizada', message: m.nome });
        }
        setModalOpen(false);
        setEditIdx(null);
    };

    const onModMenu = (i, opt) => {
        const m = mods[i];
        if (opt === 'Editar') { abrirEdicao(i); return; }
        if (opt === 'Excluir') { setMods(list => list.filter((_, j) => j !== i)); toast({ kind: 'warn', title: 'Modalidade excluída', message: `${m.nome} foi removida desta política.` }); return; }
        const status = opt === 'Ativar' ? 'Ativa' : 'Inativa';
        setMods(list => list.map((x, j) => (j === i ? { ...x, status } : x)));
        toast({ kind: status === 'Ativa' ? 'succ' : 'warn', title: `Modalidade ${status.toLowerCase()}`, message: m.nome });
    };

    const salvarPolitica = () => {
        const nome = form.nome.trim() || 'Política de Auxílio Educação';
        if (onSaved) {
            onSaved({
                id: isNew ? 'edu-' + Date.now() : policy.id, kind: 'edu',
                tile: meta.tile, icon: meta.icon, title: nome,
                desc: `${mods.length} modalidade${mods.length === 1 ? '' : 's'} configurada${mods.length === 1 ? '' : 's'}.`,
                status: form.status, statusColor: form.status === 'Ativa' ? 'green' : 'orange',
                meta: mods.filter(m => m.status === 'Ativa').map(m => m.nome).join(' · ') || 'Nenhuma modalidade ativa',
                link: 'Configurar política', modalidades: mods,
            });
        }
        toast({ kind: 'succ', title: 'Política salva', message: nome, duration: 6000 });
    };

    return (
        <div className="app-main-inner">
            <div className="bx-header bx-divider">
                <div className="td-back" onClick={onBack}><i className="fa fa-arrow-left" /> Voltar para Gestão de Benefícios</div>
                <Breadcrumb onHome={onBack} items={[
                    { label: 'Gestão de Benefícios', onClick: onBack },
                    ...(isNew ? [{ label: 'Nova política' }] : []),
                    { label: 'Auxílio Educação' },
                ]} />
            </div>

            <div className="bx-body" style={{ paddingTop: 4 }}>
                <div className="np-head">
                    <span className={`np-head-ic ${meta.tile}`}><i className={`fa ${meta.icon}`} /></span>
                    <div>
                        <h2>Auxílio Educação</h2>
                        <div className="np-head-sub">Configuração de política de benefício</div>
                    </div>
                </div>

                <div className="pol-card">
                    <EduSection icon="fa-graduation-cap" tile="soft-purple" title="Seção 1 — Identificação da Política">
                        <div className="grid grid-2 gap-16">
                            <Field label="Nome da política" required>
                                <Textfield value={form.nome} onChange={v => set('nome', v)} placeholder="Ex: Política de Auxílio Educação 2026" />
                            </Field>
                            <Field label="Empresa" required>
                                <Select value={form.empresa} onChange={v => set('empresa', v)} options={EDU_EMPRESAS} placeholder="Selecione uma opção" />
                            </Field>
                            <Field label="Filial">
                                <Select value={form.filial} onChange={v => set('filial', v)} options={EDU_FILIAIS} placeholder="Selecione uma opção" />
                            </Field>
                            <Field label="Data de vigência">
                                <Textfield type="date" value={form.dataVigencia} onChange={v => set('dataVigencia', v)} placeholder="dd/mm/aaaa" />
                            </Field>
                            <Field label="Tempo mínimo de contrato">
                                <Select value={form.tempoContrato} onChange={v => set('tempoContrato', v)} options={EDU_TEMPO_OPTS} placeholder="Selecione uma opção" />
                            </Field>
                            <Field label="Status">
                                <Select value={form.status} onChange={v => set('status', v)} options={EDU_STATUS_OPTS} />
                            </Field>
                        </div>
                    </EduSection>

                    <EduSection icon="fa-layer-group" tile="soft-blue" title="Modalidades">
                        <div className="np-actions-head">
                            <p>Cada modalidade do Auxílio Educação possui condições e regra de subsídio próprias.</p>
                            <Button priority="secondary" icon="fa-plus" onClick={abrirNova}>Adicionar modalidade</Button>
                        </div>

                        {mods.length === 0 ? (
                            <div className="pol-hist-empty" style={{ marginBottom: 12 }}>
                                Nenhuma modalidade cadastrada. Adicione a primeira modalidade desta política.
                            </div>
                        ) : (
                            <div className="np-actions">
                                {mods.map((m, i) => (
                                    <div className="np-action" key={i}>
                                        <div className="np-action-top">
                                            <span className="pol-sec-ic soft-purple"><i className="fa fa-graduation-cap" /></span>
                                            <div className="np-action-id">
                                                <div className="np-action-title">{m.nome}</div>
                                                <div className="np-action-desc">{eduSubsidioResumo(m)}</div>
                                            </div>
                                            <span className={`rhc-chip ${m.status === 'Ativa' ? 'green' : 'orange'}`}>{m.status}</span>
                                            <div className="np-action-meta">
                                                <span>Aprovação do gestor: {m.aprovacaoGestor}</span>
                                                <span>{(m.documentos || []).length} documento(s) exigido(s)</span>
                                            </div>
                                            <EduRowMenu onPick={opt => onModMenu(i, opt)} />
                                        </div>
                                        <div className="np-action-grid">
                                            <div>
                                                <div className="np-action-lbl">Condições e orientações</div>
                                                <div className="np-action-obs">{m.condicoes || 'Nenhuma condição informada.'}</div>
                                            </div>
                                            <div>
                                                <div className="np-action-lbl">Documentos necessários</div>
                                                {(m.documentos || []).length === 0
                                                    ? <div className="np-action-obs" style={{ color: 'var(--sds-fg-subtle)' }}>Nenhum documento exigido</div>
                                                    : <div className="pol-docs" style={{ marginBottom: 0 }}>
                                                        {m.documentos.map((d, j) => (
                                                            <div className="pol-doc" key={j}>
                                                                <i className="fa fa-file-lines" style={{ color: 'var(--sds-fg-muted)' }} />
                                                                <span style={{ fontSize: 14 }}>{d}</span>
                                                            </div>
                                                        ))}
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button className="pol-adddoc" onClick={abrirNova}><i className="fa fa-plus" /> Adicionar modalidade</button>
                    </EduSection>

                    <EduSection icon="fa-clipboard" tile="soft-orange" title="Observações Gerais da Política">
                        <p style={{ fontSize: 14, color: 'var(--sds-fg-muted)', margin: '-8px 0 18px' }}>Orientações exibidas ao colaborador no início do fluxo de solicitação do benefício.</p>
                        <Field label="Observações">
                            <Textarea value={form.observacoes} onChange={v => set('observacoes', v)} rows={6} maxLength={500}
                                placeholder="Ex: O colaborador deve solicitar o auxílio antes do início do curso. As condições de cada modalidade estão descritas na etapa de solicitação." />
                        </Field>
                        <div className={`pol-counter ${(form.observacoes || '').length >= 500 ? 'full' : ''}`}>{(form.observacoes || '').length}/500 caracteres</div>
                    </EduSection>

                    <EduSection icon="fa-paperclip" tile="soft-blue" title="Documentação para o Colaborador">
                        <div className="pol-grouplabel">Documentos disponíveis para os colaboradores</div>
                        <div style={{ fontSize: 14, color: 'var(--sds-fg-subtle)', marginBottom: 8 }}>Anexe regulamentos, FAQs ou orientações em PDF (até 10 anexos). Acesse:</div>
                        <div className="pol-docs">
                            {docs.map((d, i) => (
                                <div className="pol-doc" key={i}>
                                    <i className="fa fa-file-pdf" style={{ color: 'var(--sds-criticality-red)' }} />
                                    <a className="pol-doc-link" href="#" onClick={e => e.preventDefault()}>{d}</a>
                                    <i className="fa fa-xmark pol-doc-x" onClick={() => setDocs(docs.filter((_, j) => j !== i))} />
                                </div>
                            ))}
                            {docs.length === 0 && <div style={{ fontSize: 14, color: 'var(--sds-fg-subtle)' }}>Nenhum anexo adicionado</div>}
                        </div>
                        <button className="pol-adddoc" disabled={docs.length >= 10} onClick={() => { setNewDoc(''); setAddDocOpen(true); }}><i className="fa fa-plus" /> Adicionar documento</button>
                        {docs.length >= 10 && <span className="pol-counter full" style={{ marginLeft: 12 }}>Limite de 10 anexos atingido</span>}
                    </EduSection>
                </div>

                <div className="pol-actions">
                    <Button priority="default" onClick={onBack}>Cancelar</Button>
                    <div className="pol-actions-right">
                        <Button priority="primary" icon="fa-floppy-disk" onClick={salvarPolitica}>Salvar política</Button>
                    </div>
                </div>
            </div>

            <EduModalidadeModal
                open={modalOpen}
                value={editIdx === null ? null : mods[editIdx]}
                onClose={() => { setModalOpen(false); setEditIdx(null); }}
                onSave={salvarModalidade}
            />

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
                <Field label="Nome do documento" hint="Regulamento, FAQ ou orientação (PDF) — até 10 anexos.">
                    <Textfield value={newDoc} onChange={setNewDoc} placeholder="Ex: Regulamento do Auxílio Educação" />
                </Field>
            </Modal>
        </div>
    );
}

Object.assign(window, { EducationPolicyEditor, EDU_SEED_MODALIDADES });
