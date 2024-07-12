import ReactPaginate from 'react-paginate';

const Pagination = ({ pageCount, onPageChange }) => {
    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={onPageChange}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            marginPagesDisplayed={2}
            containerClassName={"pagination"}
            activeClassName={"active"}
        />
    );
};

export default Pagination;
