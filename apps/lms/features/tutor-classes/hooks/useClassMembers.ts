"use client";

import { useState } from "react";
import { normalizeClassSearch } from "../utils/classes.utils";
import { useTutorClassDetail } from "./useTutorClassDetail";
import { classMembersService } from "@workspace/core/lms-classes/members.service";
import { useLmsClassResource } from "@workspace/core/lms-classes/useLmsClassResource";

export function useClassMembers(classId: string) {
  const detail = useTutorClassDetail(classId);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [mode,setMode]=useState("current");
  const current=useLmsClassResource(classId,"members-current",s=>classMembersService.current(classId,s));
  const history=useLmsClassResource(classId,"members-history",s=>classMembersService.history(classId,s),{enabled:mode==="history"});
  const members=mode==="current"?(current.data??[]).map(m=>({...m,id:m.learnerId,fullName:m.displayName||"Chưa có tên",initials:(m.displayName||"HV").slice(0,2),email:null,avatarUrl:m.avatarUrl??null,gradeLevel:m.level||"Chưa có thông tin",leftAt:null})):
    (history.data??[]).map(m=>({...m,id:m.learnerId,fullName:m.name||"Chưa có tên",initials:(m.name||"HV").slice(0,2),email:null,avatarUrl:null,gradeLevel:"",displayName:m.name,level:null}));
  const filtered = members.filter(m=>normalizeClassSearch(`${m.fullName} ${m.accountCode ?? ""} ${m.learnerId} ${m.gradeLevel}`).includes(normalizeClassSearch(search)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12));
  const currentPage = Math.min(page, pageCount - 1);
  return { ...detail, loading:detail.loading||current.loading||(mode==="history"&&history.loading),error:detail.error??current.error??(mode==="history"?history.error:null),
    retry(){detail.retry();void current.refetch();if(mode==="history")void history.refetch();}, mode, setMode(value:string){setMode(value);setPage(0);},search, page: currentPage, pageCount, total: filtered.length,
    members: filtered.slice(currentPage * 12, (currentPage + 1) * 12), setPage,
    updateSearch(value: string) { setSearch(value); setPage(0); },
  };
}
