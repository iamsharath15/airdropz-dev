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
   <div className="p-6 bg-[#111112] rounded-xl">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 ">
    <h2 className="text-2xl font-bold text-white">User Details</h2>
    <div className="flex gap-2">
      <Button onClick={exportToExcel} className="bg-green-500 hover:bg-green-600 cursor-pointer text-white font-medium rounded-lg px-4 py-2">
        Download Excel
      </Button>
      <Button onClick={exportToPDF} className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-4 py-2 cursor-pointer">
        Download PDF
      </Button>
    </div>
  </div>

  <div className="overflow-auto rounded-2xl shadow-lg border border-zinc-700 bg-zinc-900">
    <table className="min-w-full text-sm text-white">
      <thead className="bg-zinc-800">
        <tr>
          <th className="py-4 px-6 text-left font-semibold">Username</th>
          <th className="py-4 px-6 text-left font-semibold">Email</th>
          <th className="py-4 px-6 text-left font-semibold">Airdrops Earned</th>
          <th className="py-4 px-6 text-left font-semibold">Login Streak</th>
        </tr>
      </thead>
      <tbody>
        {paginatedUsers.map((user, idx) => (
          <tr key={idx} className="border-t border-zinc-700 hover:bg-zinc-800/40 transition-all">
            <td className="py-3 px-6">{user.user_name}</td>
            <td className="py-3 px-6">{user.email}</td>
            <td className="py-3 px-6">{user.airdrops_earned}</td>
            <td className="py-3 px-6">{user.daily_login_streak_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {totalPages > 1 && (
    <div className="mt-6 flex justify-center">
      <Pagination>
        <PaginationContent className="flex gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={`rounded-lg px-3 py-1 text-white border border-zinc-700 ${
                page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-700'
              }`}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
              <button
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg border border-zinc-700 ${
                  page === i + 1
                    ? 'bg-[#8373EE] text-white font-semibold'
                    : 'text-white hover:bg-zinc-700'
                }`}
              >
                {i + 1}
              </button>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className={`rounded-lg px-3 py-1 text-white border border-zinc-700 ${
                page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-700'
              }`}
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
