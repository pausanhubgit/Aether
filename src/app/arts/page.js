'use client';

import { useEffect, Suspense } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/lib/slices/artsSlice';
import MediaFeed from "@/components/MediaFeed";
import FilterButton from "./_components/FilterButton";
import MediaSearch from "@/components/MediaSearch";
import ListGridView from "@/components/ListGridView";
import Table from "./_components/Table";
import Spinner from '@/components/Spinner';
import { useSearchParams } from 'next/navigation';

const ArtsContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { arts, categories, loading, error } = useSelector(state => state.arts);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="mx-auto w-full py-10 my-5 rounded-xl bg-red-100 text-red-600 text-2xl text-center">
        Error loading arts: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 sm:py-6 gap-4 border-b border-gray-100 dark:border-gray-800 mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight dark:text-white">
          Popular Arts
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="flex-grow lg:w-80">
            <MediaSearch placeholder="Search arts..." />
          </div>
          <div className="flex items-center gap-3">
            <FilterButton categories={categories} />
            <div className="hidden sm:block border-l border-gray-200 dark:border-gray-700 h-8 mx-1"></div>
            <ListGridView />
          </div>
        </div>
      </div>
      <div className="pb-8">
        <MediaFeed 
          type="art" 
          genre={searchParams.get('category')} 
          searchName={searchParams.get('name')}
          minPrice={searchParams.get('min')}
          maxPrice={searchParams.get('max')}
          sort={searchParams.get('sort')}
          limit={searchParams.get('limit')}
        />
      </div>
    </div>
  );
};

const Arts = () => (
  <Suspense fallback={<Spinner />}>
    <ArtsContent />
  </Suspense>
);

export default Arts;