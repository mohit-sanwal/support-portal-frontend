"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Plus,
  ChevronDown,
  LayoutDashboard,
  Shield,
  UserCircle2,
  LogOut,
  Trash2,
} from "lucide-react";

import { logout } from "../lib/api";
import { Ticket, User } from "../types";

import AssignDropdown from "../components/assignedDropdown";
import StatusDropdown from "../components/statusDropdown";
import Comments from "../components/comments";
import OverlayLoader from "@/components/loader/OverlayLoader";

import {
  getTickets,
  deleteTicket,
  createTicket,
  getCurrentUserApi,
  getAssignableUsersApi
} from "../lib/api";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");

  const [role, setRole] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [openRow, setOpenRow] = useState<number | null>(null);

  const [showMenu, setShowMenu] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [creating, setCreating] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchUser = async () => {
    try {
      const data = await getCurrentUserApi();
      setUser(data);
      setRole(data.role);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };



  const loadTickets = async (showLoader = true) => {

      if (showLoader) {
        setLoading(true);
      }

      try {
        const data = await getTickets();

        setTickets(data);
        setFilteredTickets(data);

      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }

      if (showLoader) {
        setLoading(false);
      }
  };

  const loadUsers = async () => {
    try {
      const data = await getAssignableUsersApi();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchUser();
    loadTickets();
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = tickets.filter((ticket) => {
      const text = search.toLowerCase();

      return (
        ticket.title?.toLowerCase().includes(text) ||
        ticket.description?.toLowerCase().includes(text) ||
        ticket.created_by_name?.toLowerCase().includes(text)
      );
    });

    setFilteredTickets(filtered);
  }, [search, tickets]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleCreate = async () => {

      if (creating) return;

      if (!title.trim()) return;

      try {

        setCreating(true);

        await createTicket({
          title,
          description,
        });

        setTitle("");
        setDescription("");

        setShowModal(false);

        loadTickets();

      } catch (err) {

        console.error(err);

        toast.error("Something went wrong");

      } finally {

        setCreating(false);
      }
  };

  const handleDelete = async (id: number) => {

        try {

          setDeleting(true);

          await deleteTicket(id);

          await loadTickets(false);

        } catch (err) {

          console.error(err);

          toast.error("Something went wrong");

        } finally {

          setDeleting(false);
        }
  };

  const navigateButton = () => {
    if (pathname === "/superAdmin") {
      return {
        label: "Dashboard",
        icon: <LayoutDashboard size={16} />,
        action: () => router.push("/"),
      };
    }

    if (pathname === "/admin") {
      return {
        label: "Dashboard",
        icon: <LayoutDashboard size={16} />,
        action: () => router.push("/"),
      };
    }

    if (role === "super_admin") {
      return {
        label: "Super Admin",
        icon: <Shield size={16} />,
        action: () => router.push("/superAdmin"),
      };
    }

    if (role === "admin") {
      return {
        label: "Admin Panel",
        icon: <Shield size={16} />,
        action: () => router.push("/admin"),
      };
    }

    return null;
  };

  const canDelete  = () => {

  }

  const navBtn = navigateButton();

  return (
    <div className="page">
      {deleting && (
        <OverlayLoader show={deleting} />
      )}
      {/* HEADER */}
      <header className="header">
        <div>
          <h1 className="logo">Support Portal</h1>
          <p className="subText">
            Manage tickets, assignments and discussion
          </p>
        </div>

        <div className="headerRight">
          {navBtn && (
            <button
              className="panelBtn"
              onClick={navBtn.action}
            >
              {navBtn.icon}
              {navBtn.label}
            </button>
          )}

          <div className="profileWrapper" ref={menuRef}>
            <button
              className="profileBtn"
              onClick={() => setShowMenu(!showMenu)}
            >
              <UserCircle2 size={36} />
            </button>

            {showMenu && (
              <div className="profileMenu">
                <div className="profileInfo">
                  <p className="profileName">
                    {user?.username}
                  </p>

                  <p className="profileRole">
                    Role: {user?.role}
                  </p>
                </div>

                <button
                  className="menuLogout"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SEARCH + CREATE */}
      <div className="toolbar">
        <div className="searchBox">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="createBtn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Create Ticket
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="loaderBox">
          Loading tickets...
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredTickets.length === 0 && (
        <div className="emptyState">
          No tickets found 🚀
        </div>
      )}

      {/* TABLE */}
      {!loading && filteredTickets.length > 0 && (
        <div className="tableWrapper">
          <table className="ticketTable">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                {user?.role !== "user" && (<th>Assign</th>)}
                <th>Created By</th>
                <th className="actionColumn" id="actions">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.map((t) => (
                <Fragment key={t.id}>
                  <tr>
                    <td>
                      <div className="ticketTitleCell">
                        <span className="ticketTitle">
                          {t.title}
                        </span>

                        {t.description && (
                          <span className="ticketDescPreview">
                            {t.description.length > 80
                              ? t.description.slice(0, 80) + "..."
                              : t.description}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <StatusDropdown
                        ticketId={t.id}
                        value={t.status}
                        onChange={() => loadTickets(false)}
                      />
                    </td>

                    {user?.role !== "user" && (<td>
                      <AssignDropdown
                        ticketId={t.id}
                        onAssigned={() => loadTickets(false)}
                        value={t.assigned_to}
                        users={users}
                      />
                    </td>)}

                    <td>
                      <span className="createdByText">
                        {t.created_by_name}
                      </span>
                    </td>

                    <td>
                      <div className="tableActions">
                        <button
                          className="detailsBtn"
                          onClick={() =>
                            setOpenRow(
                              openRow === t.id ? null : t.id
                            )
                          }
                        >
                          <ChevronDown size={15} />
                          {openRow === t.id
                            ? "Hide"
                            : "Details"}
                        </button>
                        {(
                          user?.role === "super_admin" ||
                          user?.id.toString() === t.created_by?.toString() ||
                          (
                            user?.role === "admin" &&
                            t.created_by_role === "user"
                          )
                         ) && (
                          <button
                            className="deleteBtn"
                            onClick={() =>
                              handleDelete(t.id)
                            }
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {openRow === t.id && (
                    <tr>
                      <td colSpan={5} className="detailsRow">
                        <div className="ticketDetails">
                          <div className="descriptionBox">
                            <h4>Description</h4>

                            <p>
                              {t.description ||
                                "No description added"}
                            </p>
                          </div>

                          <Comments
                            ticketId={t.id}
                            user={user}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    
      {/* MODAL */}
      {showModal && (
        <div
          className="modalOverlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modalHeader">
              <h2>Create Ticket</h2>

              <button
                className="closeBtn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modalBody">
              <div className="field">
                <label>Title</label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Ticket title"
                />
              </div>

              <div className="field">
                <label>Description</label>

                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe issue..."
                />
              </div>
            </div>

            <div className="modalFooter">
              <button
                className="secondaryBtn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="primaryBtn"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? (
                  <span className="btnLoader"></span>
                ) : (
                  "Create Ticket"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}