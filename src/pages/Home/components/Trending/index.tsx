import { Flex, Spinner, useToast } from '@chakra-ui/core';
import classnames from 'classnames';
import { cloneDeep } from 'lodash';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ProductApi } from '../../../../apis';
import { Alert, AnimationOnScroll, Pagination, ProductCard } from '../../../../components';
import { PRODUCT_TYPE } from '../../../../shared/enums';
import { IProduct } from '../../../../shared/interfaces';
import { ProductModel } from '../../../../shared/models';
import { getCategories } from '../../../../store/selectors';

interface IOption {
  name: string;
  value: string;
}
const CntPerPage = 4;

const initialOptions = [
  {
    name: 'Events',
    value: 'events'
  },
  {
    name: 'Songs',
    value: 'songs'
  },
  {
    name: 'Images',
    value: 'images'
  },
  {
    name: 'Videos',
    value: 'videos'
  },
  {
    name: 'Merchandise',
    value: 'merchandise'
  }
];

export const Trending: FC = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [activeOptions, setActiveOptions] = useState<IOption[]>([initialOptions[0]]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalCnt, setTotalCnt] = useState<number>(0);

  const categories = useSelector(getCategories);
  const toast = useToast();
  const { t } = useTranslation();

  const fetchProducts = () => {
    setLoading(true);
    const query: any = {};
    const categoryIds: string[] = [];
    const types: string[] = [];

    activeOptions.forEach((opt) => {
      if (opt.value === 'events') {
        types.push(PRODUCT_TYPE.VIRTUAL_EVENT);
        // query.type = PRODUCT_TYPE.VIRTUAL_EVENT
      } else if (opt.value === 'songs') {
        // query.type = PRODUCT_TYPE.SONG
        types.push(PRODUCT_TYPE.SONG);
      } else if (opt.value === 'images') {
        // query.type = PRODUCT_TYPE.SONG
        types.push(PRODUCT_TYPE.IMAGES);
      } else if (opt.value === 'videos') {
        // query.type = PRODUCT_TYPE.SONG
        types.push(PRODUCT_TYPE.VIDEOS);
      } else if (opt.value === 'merchandise') {
        // query.type = PRODUCT_TYPE.SONG
        types.push(PRODUCT_TYPE.MERCHANDISE);
      } else if (opt.value === 'all') {
        //
      } else {
        categoryIds.push(opt.value);
      }
    });

    if (categoryIds.length > 0) {
      query.category = {
        $in: categoryIds
      };
    }

    if (types.length > 0) {
      query.type = {
        $in: types
      };
    }

    ProductApi.readAll({
      query,
      options: {
        limit: CntPerPage,
        skip: (pageNumber - 1) * CntPerPage,
        sort: {
          updatedAt: 'desc'
        }
      }
    })
      .then((res) => {
        setLoading(false);
        const { pagination } = res;
        setProducts(res.products.map((product: IProduct) => new ProductModel(product)));
        setTotalCnt(pagination.total);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          position: 'top-right',
          render: ({ onClose }) => <Alert message={err.msg} color="red" onClose={onClose} />
        });
      });
  };

  const options = useMemo(() => {
    const newOptions = categories.map((cat) => ({
      name: cat.name,
      value: cat.id || ''
    }));
    return initialOptions.concat(newOptions);
  }, [categories]);

  const pageCnt = useMemo(() => {
    return Math.ceil(totalCnt / CntPerPage);
  }, [totalCnt]);

  const toggleOption = (option: IOption) => {
    const index = activeOptions.findIndex((opt) => opt.name === option.name);

    const options = cloneDeep(activeOptions);
    if (index > -1) {
      options.splice(index, 1);
    } else {
      options.push(option);
    }
    setActiveOptions(options);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [activeOptions, pageNumber]);

  return (
    <div className="section trending-section">
      <AnimationOnScroll animation="animate__zoomIn" isSubElement>
        <h2 className="text-heading2 section-title">{t('Home.Trending')}</h2>
      </AnimationOnScroll>
      <AnimationOnScroll animation="animate__backInRight trending-tabs-container" isSubElement>
        <div className="trending-tabs">
          {options.map((option, index) => (
            <h4
              key={`category-${index}`}
              className={classnames(`text-heading4 text--center ${option.name}`, {
                active: activeOptions.some((opt) => opt.name === option.name)
              })}
              onClick={() => toggleOption(option)}
            >
              {option.name}
            </h4>
          ))}
        </div>
        <hr />
      </AnimationOnScroll>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height={200}>
          <Spinner color="#00Ff00" size="xl" />
        </Flex>
      ) : (
        <div className="trending-products">
          {products.map((product, index) => (
            <AnimationOnScroll key={index} animation="animate__fadeIn" isSubElement>
              <ProductCard key={product.id} product={product} />
            </AnimationOnScroll>
          ))}
        </div>
      )}
      <Pagination pageCnt={pageCnt} activePage={pageNumber} onChange={setPageNumber} />
    </div>
  );
};
