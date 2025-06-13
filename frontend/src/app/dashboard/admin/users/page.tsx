'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface User {
  user_name: string;
  email: string;
  airdrops_earned: number;
  daily_login_streak_count: number;
}

const itemsPerPage = 5;

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/auth/v1/users');
        setUsers(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'aidropzUsers.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Username', 'Email', 'Airdrops Earned', 'Login Streak'];
    const tableRows = users.map((user) => [
      user.user_name,
      user.email,
      user.airdrops_earned,
      user.daily_login_streak_count,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('aidropzUsers.pdf');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">User Details</h2>
        <div className="flex gap-2">
          <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white">
            Download Excel
          </Button>
          <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white">
            Download PDF
          </Button>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-zinc-700">
        <table className="min-w-full text-white bg-zinc-900 text-sm">
          <thead className="bg-zinc-800">
            <tr>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Airdrops Earned</th>
              <th className="py-3 px-4 text-left">Login Streak</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, idx) => (
              <tr key={idx} className="border-t border-zinc-700">
                <td className="py-2 px-4">{user.user_name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.airdrops_earned}</td>
                <td className="py-2 px-4">{user.daily_login_streak_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <button
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      page === i + 1 ? 'bg-[#8373EE] text-white' : 'text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default UserTable;
