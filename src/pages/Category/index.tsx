import React from "react";
import { useSelector } from 'react-redux';
import { AnimationOnScroll } from "../../components";
// Store
import {getCategories} from '../../store/selectors';
import { Category } from "../Home/components";

//style
import './styles.scss';

export const CategoryPage = () =>{
    const categories = useSelector(getCategories);
    return(
        <div className="category-page">
            <div className="categories">
            {categories.map((category, index) => (
                <AnimationOnScroll key={index} animation="animate__fadeIn" isSubElement>
                <Category category={category} />
                </AnimationOnScroll>
            ))}
            </div>
        </div>
    )
}