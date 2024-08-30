// Dependencies
import { Button, FormControl, FormHelperText, FormLabel, Input, Textarea } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React, { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import { ArticleApi, CategoryApi, TicketApi } from '../../../../apis';
// Components
import { IconButton, Li, Select, Ul } from '../../../../components';
import { ROUTES } from '../../../../constants';
import { TICKET_STATUS } from '../../../../shared/enums';
import { IArticle, ICategory } from '../../../../shared/interfaces';
import { ITicket } from '../../../../shared/models';
import { getUser } from '../../../../store/selectors';
import { displayTranslation } from '../../../../utils/multi-lang';
import { getTranslation } from '../../FAQ';
// Styles
import './styles.scss';

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required!'),
  email: Yup.string().email('Email is not valid!').required('Email is required!'),
  subject: Yup.string().required('Subject is required!'),
  description: Yup.string().required('Description is required!'),
  category: Yup.string().required('Category is required!')
  // files: Yup.string().required('File is required!')
});

// Export ticket form page
export const TicketFormPage: FC = () => {
  // State
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<any>([]);
  const [ticket, setTicket] = useState<ITicket>();
  const user = useSelector(getUser);
  const [tFile, setFiles] = useState<File[]>([]);

  // Get history from hook
  const history = useHistory();

  // Get id
  const { id } = useParams<{ id: string }>();

  // Refs
  const uploadRef = useRef<HTMLInputElement>(null);

  // Avatar click handler
  const handleUploadClick = () => {
    if (uploadRef && uploadRef.current) {
      uploadRef.current?.click();
    }
  };

  // Upload handler
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].size < 20000000) {
      setFiles(files as unknown as File[]);
      // setFieldValue('files',files[0]);
    }
  };
  // Submit handler
  const handleSubmit = (values: any) => {
    const newTicket = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      newTicket.append(key, value);
    });
    newTicket.append('status', 'New');
    newTicket.append('userId', user?.id as string);

    for (const file of tFile) {
      newTicket.append('files', file);
    }

    if (id) {
      TicketApi.update(id, newTicket)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      TicketApi.create(newTicket)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    history.push(ROUTES.HELP_CENTER.TICKETS.INDEX);
  };

  const fetchArticleData = useCallback(() => {
    return ArticleApi.readAll({
      options: {
        sort: {
          updatedAt: 'desc'
        }
      }
    })
      .then((res) => {
        setArticles(res.articles);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchCategoryData = useCallback(() => {
    return CategoryApi.readAll()
      .then((res) => {
        setCategories(
          res.categories.map((item: ICategory) => ({
            label: item.name,
            value: item.name
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchTicketData = useCallback(() => {
    return TicketApi.read(id)
      .then((res) => {
        setTicket(res.ticket);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, setTicket]);

  // On mounted
  useEffect(() => {
    fetchArticleData();
    fetchCategoryData();
  }, [fetchArticleData, fetchCategoryData]);

  // On id changed
  useEffect(() => {
    if (id) {
      fetchTicketData();
    }
  }, [id, fetchTicketData]);
  // Return ticket form page
  return (
    <div className="ticket-form-page">
      <Formik
        enableReinitialize
        initialValues={{
          name: user ? user.name : '',
          email: user ? user.email : '',
          userName: user ? user.name : '',
          phoneNumber: user ? user.phoneNumber : '',
          country: ticket ? ticket.country : '',
          subject: ticket ? ticket.subject : '',
          description: ticket ? ticket.description : '',
          category: ticket ? ticket.category : '',
          files: ticket ? (ticket.files ? ticket.files : undefined) : undefined
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit }) => (
          <Form className="form" onSubmit={handleSubmit}>
            <h2 className="text-heading2 text--cyan text--regular title">Submit a ticket</h2>
            <FormControl className="d-form-control" isInvalid={Boolean(errors.name && touched.name)}>
              <FormLabel className="d-form-label required">Name</FormLabel>
              <Input
                name="name"
                value={values.name}
                className="d-form-outlined-input d-form-input--cyan"
                onChange={handleChange}
                onBlur={handleBlur}
                isDisabled={!!user}
              />
              <FormHelperText className="d-form-helper-text">
                {errors.name && touched.name && String(errors.name)}
              </FormHelperText>
            </FormControl>
            <FormControl className="d-form-control" isInvalid={Boolean(errors.email && touched.email)}>
              <FormLabel className="d-form-label required">Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={values.email}
                isDisabled={!!user}
                className="d-form-outlined-input d-form-input--cyan"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormHelperText className="d-form-helper-text">
                {errors.email && touched.email && String(errors.email)}
              </FormHelperText>
            </FormControl>
            <FormControl className="d-form-control" isInvalid={Boolean(errors.userName && touched.userName)}>
              <FormLabel className="d-form-label">Music-Store Username</FormLabel>
              <Input
                name="userName"
                value={values.userName}
                className="d-form-outlined-input d-form-input--cyan"
                onChange={handleChange}
                isDisabled={!!user}
                onBlur={handleBlur}
              />
              <FormHelperText className="d-form-helper-text">
                {errors.userName && touched.userName && String(errors.userName)}
              </FormHelperText>
            </FormControl>
            <FormControl className="d-form-control" isInvalid={Boolean(errors.phoneNumber && touched.phoneNumber)}>
              <FormLabel className="d-form-label">Phone Number linked to Music-Store Account</FormLabel>
              <Input
                name="phoneNumber"
                value={values.phoneNumber}
                className="d-form-outlined-input d-form-input--cyan"
                onChange={handleChange}
                isDisabled={!!user}
                onBlur={handleBlur}
              />
              <FormHelperText className="d-form-helper-text">
                {errors.phoneNumber && touched.phoneNumber && String(errors.phoneNumber)}
              </FormHelperText>
            </FormControl>
            <FormControl className="d-form-control" isInvalid={Boolean(errors.country && touched.country)}>
              <FormLabel className="d-form-label">Country Located</FormLabel>
              <Input
                name="country"
                value={values.country}
                className="d-form-outlined-input d-form-input--cyan"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormHelperText className="d-form-helper-text">
                {errors.country && touched.country && String(errors.country)}
              </FormHelperText>
            </FormControl>
            <FormControl className="d-form-control" isInvalid={Boolean(errors.subject && touched.subject)}>
              <FormLabel className="d-form-label required">Subject</FormLabel>
              <Input
                name="subject"
                value={values.subject}
                className="d-form-outlined-input d-form-input--cyan"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormHelperText className="d-form-helper-text">
                {errors.subject && touched.subject && String(errors.subject)}
              </FormHelperText>
            </FormControl>
            <FormControl className="d-form-control" isInvalid={Boolean(errors.description && touched.description)}>
              <FormLabel className="d-form-label required">Description</FormLabel>
              <Textarea
                name="description"
                value={values.description}
                className="d-form-outlined-textarea d-form-textarea--cyan"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormHelperText className="d-form-helper-text">
                {errors.description && touched.description && String(errors.description)}
              </FormHelperText>
            </FormControl>
            <FormControl className="d-form-control" isInvalid={Boolean(errors.category && touched.category)}>
              <FormLabel className="d-form-label required">Category</FormLabel>
              <Select
                options={categories}
                value={values.category}
                className="d-select--cyan"
                isInvalid={Boolean(errors.category && touched.category)}
                onChange={(value) => setFieldValue('category', value)}
              />
              <FormHelperText className="d-form-helper-text">
                {errors.category && touched.category && String(errors.category)}
              </FormHelperText>
            </FormControl>
            <FormControl
              className="d-form-control"
              position="relative"
              isInvalid={Boolean(errors.files && touched.files)}
            >
              <Input
                name="file"
                value="Attach a file"
                className="d-form-outlined-input d-form-input--cyan text-file-up-file-name"
                onClick={handleUploadClick}
                type="button"
              />
              <h2 className="textbody3">
                {tFile.length > 0
                  ? tFile[0].name
                  : values.files
                  ? values?.files[0]?.fieldname
                    ? values.files[0].originalname
                    : ''
                  : ''}
              </h2>

              <IconButton position="absolute" icon="attach" top="10px" left="24px" />
              <h2 className="text-body2 text-file-up-limit">Up to 20MB</h2>
              <input ref={uploadRef} type="file" accept="image/*" className="file-upload" onChange={handleUpload} />
              <FormHelperText className="d-form-helper-text">
                {errors.files && touched.files && String(errors.files)}
              </FormHelperText>
            </FormControl>
            {ticket?.answer && (
              <>
                <FormLabel className="d-form-label">Answer</FormLabel>
                <Input
                  name="Answer"
                  isDisabled
                  value={ticket?.answer}
                  className="d-form-outlined-input d-form-input--cyan"
                />
              </>
            )}
            <div className="actions">
              <Button
                type="submit"
                className="d-button d-button--cyan"
                isDisabled={ticket?.status === TICKET_STATUS.CANCELLED || ticket?.status === TICKET_STATUS.SOLVED}
              >
                Submit
              </Button>
              <Button
                className="d-outlined-button d-button--cyan"
                onClick={() => history.push(ROUTES.HELP_CENTER.TICKETS.INDEX)}
              >
                {ticket?.status === TICKET_STATUS.CANCELLED || ticket?.status === TICKET_STATUS.SOLVED
                  ? 'Back'
                  : 'Discard'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="popular">
        <Ul>Popular Articles</Ul>
        {articles.map(({ id, title }, index) => (
          <Li key={index} to={ROUTES.ARTICLE.DETAIL.replace(':id', id)}>
            {getTranslation(title)}
          </Li>
        ))}
      </div>
    </div>
  );
};
