import { cn } from "@/lib/utils";

import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationContent,
  PaginationPrevious
} from "@/components/ui/pagination";

interface PaginationSectionProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationSection = ({
  currentPage, totalPages, onPageChange,
}: PaginationSectionProps) => {
  const maxVisiblePages = 5;

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= maxVisiblePages) {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={cn(
                "cursor-pointer", currentPage === 1 ? "disabled" : ""
              )}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={cn(
                "cursor-pointer", currentPage === totalPages ? "disabled" : ""
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  const halfVisible = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  if (endPage - startPage < maxVisiblePages - 1) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    } else {
      startPage = Math.max(1, endPage - (maxVisiblePages - 1));
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className={cn(
              "cursor-pointer", currentPage === 1 ? "disabled" : ""
            )}
          />
        </PaginationItem>

        {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
          const page = startPage + index;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={page === currentPage}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            className={cn(
              "cursor-pointer", currentPage === totalPages ? "disabled" : ""
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;