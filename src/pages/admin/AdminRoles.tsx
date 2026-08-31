import React, { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { adminApi, RoleRecord } from "../../api/admin";

export const AdminRoles: React.FC = () => {
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<Record<string, Array<{ id: number; name: string }>>>({});
  const [loading, setLoading] = useState(true);

  // Create/Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchRolesAndPermissions = async () => {
    setLoading(true);
    try {
      const [rolesRes, permRes] = await Promise.all([
        adminApi.getRoles(),
        adminApi.getPermissions(),
      ]);
      setRoles(rolesRes || []);
      setPermissionGroups(permRes.grouped || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const openModal = (r?: RoleRecord) => {
    if (r) {
      setEditingRole(r);
      setRoleName(r.name);
      setSelectedPermissions(r.permissions?.map((p) => p.name) || []);
    } else {
      setEditingRole(null);
      setRoleName("");
      setSelectedPermissions([]);
    }
    setModalOpen(true);
  };

  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleGroup = (perms: Array<{ id: number; name: string }>) => {
    const allSelected = perms.every((p) => selectedPermissions.includes(p.name));
    if (allSelected) {
      const namesToRemove = perms.map((p) => p.name);
      setSelectedPermissions((prev) => prev.filter((p) => !namesToRemove.includes(p)));
    } else {
      const namesToAdd = perms.map((p) => p.name);
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...namesToAdd])));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingRole) {
        await adminApi.updateRole(editingRole.id, {
          name: roleName,
          permissions: selectedPermissions,
        });
      } else {
        await adminApi.createRole({
          name: roleName,
          permissions: selectedPermissions,
        });
      }
      setModalOpen(false);
      await fetchRolesAndPermissions();
    } catch (err: any) {
      alert(err.message || "Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      activeTab="roles"
      title="Roles & Permission Matrix"
      subtitle="Configure RBAC security policies and system permissions"
      actions={
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm"
        >
          + Create Role
        </button>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-red-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-neutral-900">{role.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 rounded text-neutral-600">
                      {role.permissions?.length || 0} permissions
                    </span>
                  </div>

                  <div className="mt-4 space-y-1 max-h-48 overflow-y-auto pr-1">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.map((p) => (
                        <div key={p.id} className="flex items-center gap-1.5 text-xs text-neutral-600 py-0.5">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{p.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-neutral-400">No permissions granted.</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <button
                    onClick={() => openModal(role)}
                    className="w-full py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-bold rounded-lg border"
                  >
                    Edit Role & Permissions →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold text-neutral-900">
                  {editingRole ? `Edit Role: ${editingRole.name}` : "Create New Role"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black">✕</button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold mb-1">Role Name *</label>
                  <input
                    type="text"
                    required
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g. Catalog Editor, Support Agent"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 text-neutral-700">Grant Permissions:</label>
                  <div className="space-y-4 border rounded-xl p-4 bg-neutral-50 max-h-72 overflow-y-auto">
                    {Object.entries(permissionGroups).map(([group, perms]) => {
                      const allSelected = perms.every((p) => selectedPermissions.includes(p.name));
                      return (
                        <div key={group} className="space-y-1.5 pb-3 border-b last:border-b-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-wider text-red-600">{group}</span>
                            <button
                              type="button"
                              onClick={() => toggleGroup(perms)}
                              className="text-[10px] font-semibold text-neutral-500 hover:text-black"
                            >
                              {allSelected ? "Deselect All" : "Select All"}
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {perms.map((p) => (
                              <label key={p.id} className="flex items-center gap-2 text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedPermissions.includes(p.name)}
                                  onChange={() => togglePermission(p.name)}
                                />
                                <span className="text-neutral-700">{p.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Role"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
