import BaseCRUD from "@/shared/services/baseCRUD.service";
import httpClient from "@/shared/services/http-common";

class FileUploadService extends BaseCRUD {
  constructor() {
    super("/documents/upload");
  }

  async upload(parentId: string, file: any) {
    const formData = new FormData();
    formData.append("file", file);

    formData.append("parentId", parentId);
    formData.append("data", "");

    return await httpClient.post(this.urlBase, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new FileUploadService();
