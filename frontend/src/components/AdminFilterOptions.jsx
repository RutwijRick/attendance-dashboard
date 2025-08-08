import React from 'react'
import { ArrowLeft, ArrowRight, DownloadCloud, File, Filter } from 'react-feather';
import { exportCSV, exportPDF } from '../utils/fn';

const AdminFilterOptions = ({ records, viewMode, setViewMode, selectedDate, setSelectedDate, filterVisible, setFilterVisible, filter, setFilter }) => {

    const changeDateBy = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const handleFilterSubmit = () => {
        if (filter.from && filter.to) {
            setViewMode("range");
            setFilterVisible(false);
        }
    };

    return (
        <div className="row">
            <div className="col-xs-12 col-md-12 col-lg-12">
                <div className="d-flex gap-2 align-items-center">
                    <select className="form-select-sm"
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="all">All Entries</option>
                    </select>

                    {viewMode === "today" && (
                        <div className="d-flex align-items-center gap-1">
                            <button size="sm" className="btn btn-outline-dark btn-sm" onClick={() => changeDateBy(-1)}>
                                <ArrowLeft />
                            </button>
                            <input className="form-control"
                                type="date"
                                value={selectedDate.toISOString().split("T")[0]}
                                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            />
                            <button size="sm" className="btn btn-outline-dark btn-sm" onClick={() => changeDateBy(1)}>
                                <ArrowRight />
                            </button>
                        </div>
                    )}

                    <button
                        className={`btn btn-outline-secondary btn-sm ${filterVisible && 'active'} ${viewMode === "range" && 'active'}`}
                        onClick={() => setFilterVisible(!filterVisible)}
                    >
                        <Filter /> Filter
                    </button>

                    <button className="btn btn-outline-success btn-sm" onClick={() => exportCSV(records)}>
                        <DownloadCloud /> Download CSV
                    </button>
                    <button className="btn btn-outline-success btn-sm" onClick={() => exportPDF(records)}>
                        <File /> Download PDF
                    </button>
                </div>
                {filterVisible && (
                    <div className="card card-body mb-3">
                        <div className="row">
                            <div className="col-md-4">
                                <label>From Date</label>
                                <input className="form-control"
                                    type="date"
                                    value={filter.from}
                                    onChange={(e) => setFilter({ ...filter, from: e.target.value })}
                                />
                            </div>
                            <div className="col-md-4">
                                <label>To Date</label>
                                <input className="form-control"
                                    type="date"
                                    value={filter.to}
                                    onChange={(e) => setFilter({ ...filter, to: e.target.value })}
                                />
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                                <button className="btn btn-success" onClick={handleFilterSubmit}>
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminFilterOptions