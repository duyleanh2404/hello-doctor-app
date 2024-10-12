import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationContent,
  PaginationEllipsis,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationSectionProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationSection = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationSectionProps) => {
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Calculate the range of pages to display
  const maxVisiblePages = 5; // Number of pages to display

  // If totalPages is less than or equal to maxVisiblePages, show all pages
  if (totalPages <= maxVisiblePages) {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? 'disabled' : ''}
            />
          </PaginationItem>

          {/* Dynamic Page Links for all available pages */}
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage} // Highlight current page
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage === totalPages ? 'disabled' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  // Calculate the range of pages to display for more than maxVisiblePages
  const halfVisible = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  // Adjust the range if the start or end exceeds limits
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
            href="#"
            onClick={() => handlePageChange(currentPage - 1)}
            className={currentPage === 1 ? 'disabled' : ''}
          />
        </PaginationItem>

        {/* Dynamic Page Links */}
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
          const page = startPage + index;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(page)}
                isActive={page === currentPage} // Highlight current page
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handlePageChange(currentPage + 1)}
            className={currentPage === totalPages ? 'disabled' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;