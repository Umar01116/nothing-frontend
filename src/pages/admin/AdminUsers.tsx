import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi, RoleRecord } from "../../api/admin";
import { DataTable, Column } from "../../components/admin/common/DataTable";

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchUsersAndRoles = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getRoles(),
      ]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const openEditModal = (u: any) => {
    setEditingUser(u);
    const userRoleNames = u.roles?.map((r: any) => (typeof r === "string" ? r : r.name)) || [];
    setSelectedRoles(userRoleNames);
  };

  const handleSaveRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      await adminApi.updateUserRoles(editingUser.id, selectedRoles);
      setEditingUser(null);
      await fetchUsersAndRoles();
      alert("User roles updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update roles");
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
    );
  };

  const columns: Column<any>[] = [
    {
      header: "Staff Member",
      accessor: (u) => (
        <div>
          <p className="font-bold text-neutral-900">{u.name}</p>
          <p className="text-xs text-neutral-500">{u.email}</p>
        </div>
      ),
    },
    {
      header: "Assigned Roles",
      accessor: (u) => (
        <div className="flex flex-wrap gap-1">
          {u.roles && u.roles.length > 0 ? (
            u.roles.map((r: any, idx: number) => {
              const name = typeof r === "string" ? r : r.name;
              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    name === "Super Admin" ? "bg-red-100 text-red-700" : "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {name}
                </span>
              );
            })
          ) : (
            <span className="text-xs text-neutral-400">No roles</span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      align: "right",
      accessor: (u) => (
        <button
          onClick={() => openEditModal(u)}
          className="text-xs font-semibold text-neutral-700 hover:text-black"
        >
          Manage Roles →
        </button>
      ),
    },
  ];

  return (
    <AdminLayout
      activeTab="users"
      title="Staff & User Management"
      subtitle="Assign operational privileges, roles, and administrative access"
    >
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          keyExtractor={(u) => u.id}
          emptyMessage="No users found."
        />
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Manage Staff Roles</h3>
                <p className="text-xs text-neutral-500">{editingUser.name} ({editingUser.email})</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-neutral-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={handleSaveRoles} className="space-y-4 text-sm">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-600">Assign Roles:</label>
                <div className="space-y-1.5 border p-3 rounded-xl bg-neutral-50">
                  {roles.map((r) => {
                    const checked = selectedRoles.includes(r.name);
                    return (
                      <label key={r.id} className="flex items-center gap-2.5 cursor-pointer py-1 text-xs">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRole(r.name)}
                        />
                        <span className="font-semibold text-neutral-800">{r.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Roles"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
