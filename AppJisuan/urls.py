#!/usr/bin/env python
# -*- encoding: utf-8 -*-
'''
@File    :   urls.py.py    
@Contact :   zhangyinjun1993@gmail.com


@Modify Time      @Author        @Version    @Desciption
------------      -------        --------    -----------
2020/9/13 17:37   InjuneZhang      1.0         None
'''

# import lib
from django.conf.urls import url

from AppJisuan import views

urlpatterns = [
    # url(r'^home/',views.handlehome),
    url(r'^login/',views.handlelogin),
    # url('',views.handlelogin),
    url(r'^insertname/',views.insertname),
    url(r'^calcu/',views.calcu),
    # url(r'^testindex/',views.testindex),
    # url(r'^testadd/',views.testadd),
    # url(r'^commit/',views.handlecommit),
]