/**
 * CommissionBracketsAdmin.tsx — admin UI to view/edit/activate commission brackets.
 *
 * ⚠️  MUTATION NAMES ARE NOT VERIFIED. Before pushing this, verify every
 *     operation below matches the actual schema on the admin backend by
 *     running one of:
 *
 *        1. Introspection from the deployed GraphQL endpoint:
 *             curl -s https://verify.jusoor-sa.co/graphql \
 *               -H 'content-type: application/json' \
 *               -d '{"query":"{ __schema { queryType { fields { name } } mutationType { fields { name } } } }"}'
 *
 *        2. grep inside jasoor-backend-main/src/graphql/ for "Commission".
 *
 *     Then edit the constants in the OPERATIONS block below to match. The
 *     component will still mount with wrong names but every query will return
 *     `Cannot query field "xxx"` in the Network tab.
 *
 * Product requirements (from task brief §D):
 *   - admin can create / edit brackets
 *   - admin can activate / deactivate a version (versioning must be respected)
 *   - historical deals keep their old bracket (enforced server-side, NOT here)
 *   - UI must be honest about which version is active
 */

import React, { useMemo, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// ---------------------------------------------------------------------------
// OPERATIONS — UPDATE THESE NAMES BEFORE PUSHING. See comment at top.
// ---------------------------------------------------------------------------
const GET_COMMISSION_BRACKETS = gql`
  query GetCommissionBrackets($version: Int) {
    getCommissionBrackets(version: $version) {
      id
      version
      minAmount
      maxAmount
      percentage
      fixedFee
      isActive
      createdAt
    }
  }
`;

const GET_ACTIVE_COMMISSION_VERSION = gql`
  query GetActiveCommissionVersion {
    getActiveCommissionVersion {
      version
      activatedAt
      activatedByAdminId
    }
  }
`;

const CREATE_COMMISSION_BRACKET = gql`
  mutation CreateCommissionBracket($input: CreateCommissionBracketInput!) {
    createCommissionBracket(input: $input) {
      id
      version
    }
  }
`;

const UPDATE_COMMISSION_BRACKET = gql`
  mutation UpdateCommissionBracket($input: UpdateCommissionBracketInput!) {
    updateCommissionBracket(input: $input) {
      id
    }
  }
`;

const ACTIVATE_COMMISSION_VERSION = gql`
  mutation ActivateCommissionVersion($version: Int!) {
    activateCommissionVersion(version: $version) {
      version
      activatedAt
    }
  }
`;
// ---------------------------------------------------------------------------

interface Bracket {
  id: string;
  version: number;
  minAmount: number;
  maxAmount: number | null;
  percentage: number;
  fixedFee: number | null;
  isActive: boolean;
}

interface BracketsData {
  getCommissionBrackets?: Bracket[];
}
interface ActiveVersionData {
  getActiveCommissionVersion?: { version: number; activatedAt: string } | null;
}

interface Props {
  isAr?: boolean;
}

export const CommissionBracketsAdmin: React.FC<Props> = ({ isAr = false }) => {
  const [viewVersion, setViewVersion] = useState<number | null>(null);

  const activeVersionQ = useQuery<ActiveVersionData>(GET_ACTIVE_COMMISSION_VERSION, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  const bracketsQ = useQuery<BracketsData>(GET_COMMISSION_BRACKETS, {
    variables: { version: viewVersion },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  const [createBracket, createState] = useMutation(CREATE_COMMISSION_BRACKET, {
    errorPolicy: 'all',
    refetchQueries: ['GetCommissionBrackets'],
  });
  const [updateBracket, updateState] = useMutation(UPDATE_COMMISSION_BRACKET, {
    errorPolicy: 'all',
    refetchQueries: ['GetCommissionBrackets'],
  });
  const [activateVersion, activateState] = useMutation(ACTIVATE_COMMISSION_VERSION, {
    errorPolicy: 'all',
    refetchQueries: ['GetCommissionBrackets', 'GetActiveCommissionVersion'],
  });

  const active = activeVersionQ.data?.getActiveCommissionVersion;
  const brackets = bracketsQ.data?.getCommissionBrackets ?? [];

  const sorted = useMemo(
    () => [...brackets].sort((a, b) => a.minAmount - b.minAmount),
    [brackets],
  );

  const [draft, setDraft] = useState<Partial<Bracket>>({
    minAmount: 0,
    maxAmount: null,
    percentage: 0,
    fixedFee: 0,
  });

  const handleAdd = async () => {
    if (draft.minAmount == null || draft.percentage == null) return;
    await createBracket({
      variables: {
        input: {
          minAmount: Number(draft.minAmount),
          maxAmount: draft.maxAmount != null ? Number(draft.maxAmount) : null,
          percentage: Number(draft.percentage),
          fixedFee: draft.fixedFee != null ? Number(draft.fixedFee) : 0,
        },
      },
    });
  };

  const handleToggleActive = async (b: Bracket) => {
    await updateBracket({
      variables: { input: { id: b.id, isActive: !b.isActive } },
    });
  };

  const handleActivateVersion = async (version: number) => {
    if (!confirm(
      isAr
        ? `تفعيل النسخة ${version}؟ ستصبح نافذة على العروض الجديدة فقط.`
        : `Activate version ${version}? It will apply to new offers only.`,
    )) return;
    await activateVersion({ variables: { version } });
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
      <header className="flex items-start justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">
            {isAr ? 'إدارة شرائح العمولة' : 'Commission brackets'}
          </h2>
          <p className="text-sm text-gray-600 mt-1 max-w-xl">
            {isAr
              ? 'يتم حساب العمولة حسب الشرائح النشطة وقت إنشاء العرض. الصفقات السابقة تحتفظ بالنسخة التي أُنشئت بها.'
              : 'Commissions are computed from the bracket that was active when the offer was created. Past deals keep their original version.'}
          </p>
        </div>
        <div className="text-sm bg-[#E6F3EF] text-[#004E39] rounded-xl px-3 py-2">
          {isAr ? 'النسخة النشطة الآن:' : 'Currently active version:'}{' '}
          <span className="font-bold">
            {active ? `v${active.version}` : isAr ? 'غير محددة' : 'none'}
          </span>
        </div>
      </header>

      {/* Version picker */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm font-medium text-[#111827]">
          {isAr ? 'عرض نسخة:' : 'Viewing version:'}
        </label>
        <input
          type="number"
          value={viewVersion ?? ''}
          onChange={(e) =>
            setViewVersion(e.target.value === '' ? null : Number(e.target.value))
          }
          placeholder={isAr ? 'الحالية' : 'current'}
          className="w-28 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008A66]"
        />
        {viewVersion != null && active?.version !== viewVersion ? (
          <button
            disabled={activateState.loading}
            onClick={() => handleActivateVersion(viewVersion)}
            className="bg-[#008A66] text-white font-bold px-4 py-2 rounded-xl hover:bg-[#007053] transition-colors disabled:opacity-50"
          >
            {isAr ? 'تفعيل هذه النسخة' : 'Activate this version'}
          </button>
        ) : null}
      </div>

      {/* Brackets table */}
      <div className="overflow-x-auto border border-gray-100 rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-[#111827]">
            <tr>
              <th className="text-start px-3 py-2">{isAr ? 'من' : 'Min'}</th>
              <th className="text-start px-3 py-2">{isAr ? 'إلى' : 'Max'}</th>
              <th className="text-start px-3 py-2">{isAr ? 'النسبة %' : 'Percentage %'}</th>
              <th className="text-start px-3 py-2">{isAr ? 'رسم ثابت' : 'Fixed fee'}</th>
              <th className="text-start px-3 py-2">{isAr ? 'الحالة' : 'Status'}</th>
              <th className="text-end px-3 py-2">{isAr ? 'إجراء' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            {bracketsQ.loading && !sorted.length ? (
              <tr><td colSpan={6} className="px-3 py-4 text-gray-500 text-center">
                {isAr ? 'جارٍ التحميل...' : 'Loading...'}
              </td></tr>
            ) : !sorted.length ? (
              <tr><td colSpan={6} className="px-3 py-4 text-gray-500 text-center">
                {isAr ? 'لا توجد شرائح لهذه النسخة.' : 'No brackets for this version.'}
              </td></tr>
            ) : (
              sorted.map((b) => (
                <tr key={b.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">{b.minAmount.toLocaleString()}</td>
                  <td className="px-3 py-2">{b.maxAmount?.toLocaleString() ?? '∞'}</td>
                  <td className="px-3 py-2">{b.percentage}</td>
                  <td className="px-3 py-2">{(b.fixedFee ?? 0).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <span className={
                      'text-xs font-bold px-2 py-1 rounded-full ' +
                      (b.isActive
                        ? 'bg-[#E6F3EF] text-[#004E39]'
                        : 'bg-gray-100 text-gray-600')
                    }>
                      {b.isActive ? (isAr ? 'نشطة' : 'Active') : (isAr ? 'معطّلة' : 'Disabled')}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-end">
                    <button
                      onClick={() => handleToggleActive(b)}
                      disabled={updateState.loading}
                      className="text-sm font-bold text-[#008A66] hover:text-[#007053] disabled:opacity-50"
                    >
                      {b.isActive ? (isAr ? 'تعطيل' : 'Disable') : (isAr ? 'تفعيل' : 'Enable')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create new bracket */}
      <div className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-4">
        <h3 className="font-bold text-[#111827] mb-3">
          {isAr ? 'إضافة شريحة جديدة' : 'Add new bracket'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label className="block">
            <span className="text-xs text-gray-600">{isAr ? 'الحد الأدنى' : 'Min amount'}</span>
            <input
              type="number"
              value={draft.minAmount ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, minAmount: Number(e.target.value) }))}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008A66]"
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-600">{isAr ? 'الحد الأعلى' : 'Max amount (blank = ∞)'}</span>
            <input
              type="number"
              value={draft.maxAmount ?? ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, maxAmount: e.target.value === '' ? null : Number(e.target.value) }))
              }
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008A66]"
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-600">{isAr ? 'النسبة %' : 'Percentage %'}</span>
            <input
              type="number"
              step="0.01"
              value={draft.percentage ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, percentage: Number(e.target.value) }))}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008A66]"
            />
          </label>
          <label className="block">
            <span className="text-xs text-gray-600">{isAr ? 'رسم ثابت' : 'Fixed fee'}</span>
            <input
              type="number"
              value={draft.fixedFee ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, fixedFee: Number(e.target.value) }))}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008A66]"
            />
          </label>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleAdd}
            disabled={createState.loading}
            className="bg-[#008A66] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#007053] transition-colors disabled:opacity-50"
          >
            {isAr ? 'إضافة' : 'Add bracket'}
          </button>
          {(createState.error || updateState.error || activateState.error) ? (
            <span className="text-sm text-red-600">
              {createState.error?.message ||
                updateState.error?.message ||
                activateState.error?.message}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CommissionBracketsAdmin;
