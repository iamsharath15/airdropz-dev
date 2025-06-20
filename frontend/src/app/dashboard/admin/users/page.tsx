'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { User } from '@/types';
import { Download, FileDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface UserApiResponse {
  data: User[];
  meta: {
    total: number;
  };
}

const perPage = 10;

const fetchUsers = async (page: number): Promise<UserApiResponse> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/v1/users?page=${page}&per_page=${perPage}`,
    { withCredentials: true }
  );
  return res.data;
};

const UserTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery<UserApiResponse, Error>({
    queryKey: ['users', page],
    queryFn: () => fetchUsers(page),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const users: User[] = data?.data || [];
  const total: number = data?.meta?.total || 0;
  const totalPages = Math.ceil(total / perPage);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'lootCrateUsers.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      'Username',
      'Email',
      'Airdrops Earned',
      'Login Streak',
    ];
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

    doc.save('lootCrateUsers.pdf');
  };
  if (isLoading) return <p className="text-white">Loading...</p>;
  if (isError) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : error.message;

    return <p className="text-red-500">Error: {errorMessage}</p>;
  }

  return (
    <div className="p-6 bg-[#111112] rounded-xl">
      <div className="flex flex-row justify-between items-start md:items-center mb-6 gap-4 ">
        <h2 className="md:stext-2xl text-xl font-bold text-white">
          User Details
        </h2>
        <div className="flex gap-2 ">
          <Button
            onClick={exportToExcel}
            className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <span className="block md:hidden">
              <FileDown className="w-5 h-5" />
            </span>
            <span className="hidden md:block">Download Excel</span>
          </Button>
          <Button
            onClick={exportToPDF}
            className="bg-[#8373EE] hover:bg-[#8373EE]/80 text-white font-medium rounded-lg px-4 py-2 cursor-pointer flex items-center gap-2"
          >
            <span className="block md:hidden">
              <Download className="w-5 h-5" />
            </span>
            <span className="hidden md:block">Download PDF</span>
          </Button>
        </div>
      </div>

      <div className="overflow-auto rounded-2xl shadow-lg border border-zinc-700 bg-zinc-900">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-zinc-800">
            <tr>
              <th className="py-4 px-6 text-left font-semibold">Username</th>
              <th className="py-4 px-6 text-left font-semibold">Email</th>
              <th className="py-4 px-6 text-left font-semibold">
                Airdrops Earned
              </th>
              <th className="py-4 px-6 text-left font-semibold">
                Login Streak
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={idx}
                className="border-t border-zinc-700 hover:bg-zinc-800/40 transition-all"
              >
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
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className={`rounded-lg px-3 py-1 text-white border border-zinc-700 ${
                    page === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-zinc-700'
                  }`}
                >
                  Previous
                </button>
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <button
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded-lg border border-zinc-700 cursor-pointer ${
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
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`rounded-lg px-3 py-1 text-white border border-zinc-700 ${
                    page === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-zinc-700'
                  }`}
                >
                  Next
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default UserTable;
