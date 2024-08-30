// Dependencies
import React from 'react';
import { Button } from '@chakra-ui/core';

// Component
import { Icon } from '../Icon';

// Styles
import './styles.scss';
import classnames from 'classnames';

// Interfaces
interface IPaginationProps {
    pageCnt: number;
    activePage?: number;
    onChange?: (page: number) => void;
    placement?: 'left' | 'right' | 'center';
}

// Export pagination component
export const Pagination: React.FC<IPaginationProps> = ({
    pageCnt = 10,
    activePage = 1,
    onChange,
    placement = 'right'
}) => {
    // Page change handler
    const handlePageChange = (page: number) => {
        if (onChange && page > 0 && page <= pageCnt) {
            onChange(page);
        }
    };

    // Prev handler
    const handlePrev = () => {
        handlePageChange(activePage - 1);
    };

    // Next handler
    const handleNext = () => {
        handlePageChange(activePage + 1);
    };

    // Return page component
    return pageCnt > 1 ? (
        <div className={`d-pagination ${placement}`}>
            <div className="d-pagination-buttons">
                <Button className="d-outlined-button action-button" onClick={handlePrev} isDisabled={activePage === 1}>
                    <Icon name="arrow-left" />
                </Button>
                {new Array(pageCnt).fill(0).map((_, index) => {
                    let cnt = 0;
                    if (pageCnt > 6) {
                        if (index > 2 && index < pageCnt - 2) {
                            if (activePage - 1 === index) {
                                cnt = index + 1;
                            }
                        }
                        else if (index === 2) {
                            if (activePage === index + 1) {
                                cnt = index + 1;
                            }
                            else if (activePage > 2) {
                                cnt = -1;
                            }
                        }
                        else if (index === pageCnt - 2) {
                            if (activePage === index + 1) {
                                cnt = index + 1;
                            }
                            else if (activePage <= pageCnt - 2) {
                                cnt = -1;
                            }
                        }
                        else {
                            cnt = index + 1;
                        }
                    }
                    else {
                        cnt = index + 1;
                    }
                    if (cnt > 0) {
                        return (
                            <Button
                                key={`page-button-${index}`}
                                onClick={() => handlePageChange(index + 1)}
                                className={classnames('page-button', {
                                    active: activePage === index + 1,
                                    'd-button': activePage === index + 1,
                                    'd-outlined-button': activePage !== index + 1
                                })}
                            >
                                {cnt}
                            </Button>
                        );
                    }
                    else if (cnt < 0) {
                        return (
                            <Button
                                key={`page-button-${index}`}
                                onClick={() => handlePageChange(index + 1)}
                                className={classnames('page-button', {
                                    active: activePage === index + 1,
                                    'd-button': activePage === index + 1,
                                    'd-outlined-button': activePage !== index + 1
                                })}
                            >
                                ...
                            </Button>
                        );
                    }
                    else {
                        return (<></>);
                    }
                })}
                <Button onClick={handleNext} className="d-outlined-button action-button" isDisabled={activePage === pageCnt}>
                    <Icon name="arrow-right" />
                </Button>
            </div>
        </div>
    ) : null;
};
